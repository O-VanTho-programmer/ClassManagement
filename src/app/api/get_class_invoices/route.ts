import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        if (!classId) {
            return NextResponse.json({ message: "Bad Request: classId is required" }, { status: 400 });
        }

        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_STUDENT, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryGetClassInvoices = `
            SELECT 
                i.InvoiceId AS invoice_id,
                i.StudentId AS student_id,
                s.Name AS student_name,
                i.IsPaid AS is_paid,
                i.Version AS version,
                i.Amount AS amount,
                DATE_FORMAT(i.DueDate, '%Y-%m-%d') AS due_date,
                DATE_FORMAT(i.CreatedDate, '%Y-%m-%d %H:%i:%s') AS created_date
            FROM invoice i
            INNER JOIN student s ON i.StudentId = s.StudentId
            WHERE i.ClassId = ?
            ORDER BY s.Name ASC, i.Version DESC
        `;

        const [invoices] = await pool.query(queryGetClassInvoices, [classId]);

        return NextResponse.json({ message: "Success", invoices }, { status: 200 });
    } catch (error) {
        console.error("Error fetching class invoices:", error);
        return NextResponse.json({ message: "Error fetching class invoices" }, { status: 500 });
    }
}
