import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";
import formatOverlapClasses from "@/utils/Format/formatOverlapClasses";
import type { PoolConnection } from "mysql2/promise";
import { dispatchNotification } from "@/lib/notifications";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        connection = await pool.getConnection();

        const { studentIds, classId, enrollDate } = await req.json();

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json({ message: "Student IDs are required" }, { status: 400 });
        }

        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.ADD_STUDENT_CLASS, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const [currentClass]: any[] = await connection.query(
            "SELECT Status, StartDate, Tuition, TuitionType, Name, TeacherUserId, AssistantUserId FROM class WHERE ClassId = ?",
            [classId]
        );

        if (currentClass.length === 0) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        if (currentClass[0].Status !== "Active") {
            return NextResponse.json({ message: "Class is not active" }, { status: 400 });
        }

        const placeholders = studentIds.map(() => '?').join(', ');

        const queryCheckAvailableScheduledClass = `
            SELECT 
                old_s.DaysOfWeek as day_of_week,
                old_s.StartTime as start_time,
                old_s.EndTime as end_time,
                new_s.DaysOfWeek as new_d,
                new_s.StartTime as new_start,
                new_s.EndTime as new_end,
                s.Name as student_name,
                s.StudentId as student_id,
                c.Name as class_name,
                c.ClassId as class_id
            FROM class_student cs
            JOIN class c ON c.ClassId = cs.ClassId AND c.Status = 'Active' 
            JOIN student s ON s.StudentId = cs.StudentId
            JOIN schedule old_s ON old_s.ClassId = cs.ClassId
            JOIN schedule new_s ON new_s.ClassId = ?
            WHERE 
                cs.StudentId IN (${placeholders})
                AND old_s.DaysOfWeek = new_s.DaysOfWeek  
                AND old_s.StartTime < new_s.EndTime 
                AND old_s.EndTime > new_s.StartTime;     
        `;
        const [conflicts]: any[] = await connection.query(queryCheckAvailableScheduledClass, [classId, ...studentIds]);

        if (conflicts.length > 0) {
            const overlapClasses = formatOverlapClasses(conflicts);

            return NextResponse.json({
                message: "Schedule conflict detected. You are already enrolled in a class during this time.",
                overlap_classes: overlapClasses
            }, { status: 409 });
        }

        const assignStudentsToClassValues = studentIds.map((studentId: string) => [classId, studentId, enrollDate]);

        const startDate = new Date(currentClass[0].StartDate);
        const dueDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

        const newStudentInvoice = studentIds.map((studentId: string) => [
            classId,
            studentId,
            false,
            1,
            currentClass[0].Tuition,
            dueDate,
        ]);

        const queryAddStudentIntoClass = `
            INSERT INTO class_student (ClassId, StudentId, EnrollDate)
            VALUES ?
        `;

        const queryNewStudentInvoice = `
            INSERT INTO invoice (ClassId, StudentId, IsPaid, Version, Amount, DueDate)
            VALUES ?
        `;

        await connection.beginTransaction();
        try {
            await connection.query(queryAddStudentIntoClass, [assignStudentsToClassValues]);
            await connection.query(queryNewStudentInvoice, [newStudentInvoice]);
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        }

        // Fetch student names for notification content
        try {
            const [students]: any[] = await connection.query(
                "SELECT Name FROM student WHERE StudentId IN (?)",
                [studentIds]
            );
            const studentNames = students.map((s: any) => s.Name).join(", ");
            const className = currentClass[0].Name;

            await dispatchNotification({
                hubId: Number(hubId),
                classId: Number(classId),
                title: `New Student Enrollment`,
                snippet: `${studentNames} enrolled in ${className}.`,
                content: `<p>Dear Teacher,</p>
                          <p>We are notifying you that new students have been enrolled in your class <b>${className}</b>.</p>
                          <div class="my-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <p class="text-sm font-semibold text-gray-800">Enrolled Students:</p>
                            <p class="text-xs text-gray-600">${studentNames}</p>
                          </div>
                          <p>Please check the attendance log and schedule settings for your class.</p>`,
                category: 'class',
                type: 'student_enrolled',
                deepLink: `/dashboard/hub/${hubId}/classes`
            });
        } catch (errNotif) {
            console.error("Error dispatching enrollment notification:", errNotif);
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error("Error adding student into class API:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}