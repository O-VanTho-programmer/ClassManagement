import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { dispatchNotification } from "@/lib/notifications";
import type { PoolConnection } from "mysql2/promise";

function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date.getTime());
    const d = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + months);
    if (newDate.getDate() < d) {
        newDate.setDate(0); // set to last day of previous month
    }
    return newDate;
}

function formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req: NextRequest) {
    // Prevent Unauthorized
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        // ----------------------------------------------------
        // Part 1: Recurring Invoices Generation
        // ----------------------------------------------------
        
        // Fetch active classes with recurring tuition and their enrolled students
        const getEnrollmentsQuery = `
            SELECT 
                c.ClassId,
                c.Name AS ClassName,
                c.StartDate,
                c.EndDate,
                c.Tuition,
                c.TuitionType,
                c.HubId,
                c.BillingIntervalMonths,
                cs.StudentId,
                s.Name AS StudentName
            FROM class c
            INNER JOIN class_student cs ON c.ClassId = cs.ClassId
            INNER JOIN student s ON cs.StudentId = s.StudentId
            WHERE c.Status = 'Active'
              AND c.TuitionType IN ('Monthly', 'Quarter')
        `;

        const [enrollments]: any[] = await connection.query(getEnrollmentsQuery);

        // Fetch existing invoices for these active classes to prevent duplicates
        const getExistingInvoicesQuery = `
            SELECT ClassId, StudentId, Version 
            FROM invoice 
            WHERE ClassId IN (
                SELECT ClassId FROM class WHERE Status = 'Active'
            )
        `;
        const [existingInvoices]: any[] = await connection.query(getExistingInvoicesQuery);

        const existingInvoicesSet = new Set<string>();
        for (const row of existingInvoices) {
            existingInvoicesSet.add(`${row.ClassId}-${row.StudentId}-${row.Version}`);
        }

        const today = new Date();
        // Set today to the very end of the day to make date checks timezone-safe
        today.setHours(23, 59, 59, 999);

        const newInvoices: any[] = [];

        for (const row of enrollments) {
            const cycleMonths = row.BillingIntervalMonths || (row.TuitionType === "Quarter" ? 3 : 1);
            const classStartDate = new Date(row.StartDate);
            const classEndDate = new Date(row.EndDate);

            let version = 1;
            while (true) {
                const cycleStartDate = addMonths(classStartDate, (version - 1) * cycleMonths);

                // Terminate if the cycle starts on/after the class has ended,
                // or if the cycle starts in the future.
                if (cycleStartDate.getTime() >= classEndDate.getTime() || cycleStartDate.getTime() > today.getTime()) {
                    break;
                }

                const invoiceKey = `${row.ClassId}-${row.StudentId}-${version}`;
                if (!existingInvoicesSet.has(invoiceKey)) {
                    const dueDate = new Date(cycleStartDate.getTime());
                    dueDate.setDate(dueDate.getDate() + 14); // Due date is 14 days after cycle start

                    newInvoices.push({
                        classId: row.ClassId,
                        className: row.ClassName,
                        hubId: row.HubId,
                        studentId: row.StudentId,
                        studentName: row.StudentName,
                        version,
                        amount: row.Tuition,
                        dueDate,
                        cycleStartDate
                    });
                }

                version++;
            }
        }

        // Insert new invoices and dispatch notifications within a transaction
        if (newInvoices.length > 0) {
            await connection.beginTransaction();
            try {
                const insertInvoiceQuery = `
                    INSERT INTO invoice (ClassId, StudentId, IsPaid, Version, Amount, DueDate, CreatedDate, UpdatedDate)
                    VALUES ?
                `;

                const invoiceValues = newInvoices.map(inv => [
                    inv.classId,
                    inv.studentId,
                    0, // IsPaid = 0 (Unpaid)
                    inv.version,
                    inv.amount,
                    formatDate(inv.dueDate),
                    new Date(),
                    new Date()
                ]);

                await connection.query(insertInvoiceQuery, [invoiceValues]);
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            }

            // Group new invoices by class to send a consolidated notification per class
            const groupedByClass: { [classId: number]: any[] } = {};
            for (const inv of newInvoices) {
                if (!groupedByClass[inv.classId]) {
                    groupedByClass[inv.classId] = [];
                }
                groupedByClass[inv.classId].push(inv);
            }

            for (const classIdStr of Object.keys(groupedByClass)) {
                const classId = Number(classIdStr);
                const classInvs = groupedByClass[classId];
                const firstInv = classInvs[0];

                const studentListHtml = classInvs
                    .map(inv => `<li><b>${inv.studentName}</b> (Cycle ${inv.version}): $${Number(inv.amount).toLocaleString('en-US')} (Due: ${formatDate(inv.dueDate)})</li>`)
                    .join("");

                await dispatchNotification({
                    hubId: firstInv.hubId,
                    classId,
                    title: `New Tuition Invoices Generated`,
                    snippet: `Generated invoices for ${classInvs.length} students in class ${firstInv.className}.`,
                    content: `<p>Dear Teacher,</p>
                              <p>We are notifying you that new tuition invoices have been generated for class <b>${firstInv.className}</b>.</p>
                              <div class="my-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <p class="text-sm font-semibold text-gray-800 mb-2">Billed Students:</p>
                                <ul class="list-disc pl-5 text-xs text-gray-600 space-y-1 animate-fadeIn">
                                  ${studentListHtml}
                                </ul>
                              </div>
                              <p>Please check the billing dashboard to track their payment status.</p>`,
                    category: 'class',
                    type: 'invoice_generated',
                    deepLink: `/dashboard/hub/${firstInv.hubId}/classes/${classId}/invoices`
                });
            }
        }

        // ----------------------------------------------------
        // Part 2: Overdue Invoices Alerts
        // ----------------------------------------------------
        
        // Fetch all unpaid invoices whose due date is in the past for active classes
        const getOverdueInvoicesQuery = `
            SELECT 
                i.InvoiceId,
                i.ClassId,
                i.StudentId,
                i.Version,
                i.Amount,
                DATE_FORMAT(i.DueDate, '%Y-%m-%d') AS DueDate,
                s.Name AS StudentName,
                c.Name AS ClassName,
                c.HubId
            FROM invoice i
            INNER JOIN student s ON i.StudentId = s.StudentId
            INNER JOIN class c ON i.ClassId = c.ClassId
            WHERE c.Status = 'Active'
              AND i.IsPaid = 0
              AND i.DueDate < DATE(NOW())
        `;

        const [overdueInvoices]: any[] = await connection.query(getOverdueInvoicesQuery);

        // Fetch already sent overdue notifications to prevent duplicates
        const getSentOverdueNotifsQuery = `
            SELECT ClassId, Title FROM notification
            WHERE Type = 'invoice_overdue'
        `;
        const [sentOverdueNotifs]: any[] = await connection.query(getSentOverdueNotifsQuery);

        const sentOverdueSet = new Set<string>();
        for (const notif of sentOverdueNotifs) {
            sentOverdueSet.add(`${notif.ClassId}-${notif.Title}`);
        }

        for (const inv of overdueInvoices) {
            const title = `Overdue Tuition Alert: ${inv.StudentName} (Cycle ${inv.Version})`;
            const overdueKey = `${inv.ClassId}-${title}`;

            if (!sentOverdueSet.has(overdueKey)) {
                await dispatchNotification({
                    hubId: inv.HubId,
                    classId: inv.ClassId,
                    title,
                    snippet: `Tuition invoice for ${inv.StudentName} is overdue since ${inv.DueDate}.`,
                    content: `<p>Dear Teacher,</p>
                              <p>This is an automated warning that the tuition invoice for student <b>${inv.StudentName}</b> in class <b>${inv.ClassName}</b> has become overdue.</p>
                              <div class="my-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                                <p class="text-sm font-semibold mb-1">Overdue Balance Details:</p>
                                <p class="text-xs">Cycle: ${inv.Version}</p>
                                <p class="text-xs">Amount: $${Number(inv.Amount).toLocaleString('en-US')}</p>
                                <p class="text-xs">Due Date: ${inv.DueDate}</p>
                              </div>
                              <p>Please reach out to the student or parent to resolve this outstanding balance.</p>`,
                    category: 'class',
                    type: 'invoice_overdue',
                    deepLink: `/dashboard/hub/${inv.HubId}/classes/${inv.ClassId}/invoices`
                });
            }
        }

        return NextResponse.json({
            message: "Success",
            generatedCount: newInvoices.length,
            overdueCount: overdueInvoices.length
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in billing check_invoices cron:", error);
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
