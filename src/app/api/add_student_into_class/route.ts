import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";
import formatOverlapClasses from "@/utils/Format/formatOverlapClasses";

export async function POST(req: Request) {
    let connection;
    try {
        connection = await pool.getConnection();

        const { studentIds, classId, enrollDate } = await req.json();

        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.ADD_STUDENT_CLASS, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        connection.beginTransaction();

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
        const [conflicts]: any[] = await pool.query(queryCheckAvailableScheduledClass, [classId, ...studentIds]);

        if (conflicts.length > 0) {
            await connection.rollback();
            const overlapClasses = formatOverlapClasses(conflicts);

            return NextResponse.json({
                message: "Schedule conflict detected. You are already enrolled in a class during this time.",
                overlap_classes: overlapClasses
            }, { status: 409 })

        }

        const assignStudentsToClassValues = studentIds.map((studentId: string) => [classId, studentId, enrollDate]);

        const queryAddStudentIntoClass = `
            INSERT INTO class_student (ClassId, StudentId, EnrollDate)
            VALUES ?
        `;

        await pool.query(queryAddStudentIntoClass, [assignStudentsToClassValues]);

        connection.commit();
        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        if (connection) connection.rollback();
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }

}