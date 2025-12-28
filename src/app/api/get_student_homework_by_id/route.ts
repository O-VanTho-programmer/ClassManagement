import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentHomeworkId = searchParams.get("studentHomeworkId");
        
        // Get hubId from studentHomeworkId
        const [studentHomework]: any[] = await pool.query(`
            SELECT h.HubId 
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);
        
        if (studentHomework.length === 0) {
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }
        
        const hubId = studentHomework[0].HubId;
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryGetStudentHomeworkById = `
            SELECT 
                s.Name as name,
                ch.AssignedDate as assigned_date,
                ch.DueDate as due_date,
                sh.StudentHomeworkId as student_homework_id,
                sh.Status as homework_status,
                sh.SubmittedDate as submitted_date
            FROM student_homework sh
            JOIN student s ON s.StudentId = sh.StudentId
            JOIN class_homework ch ON ch.ClassHomeworkId = sh.ClassHomeworkId
            WHERE sh.StudentHomeworkId = ?     
        `;

        const [row] : any[] = await pool.query(queryGetStudentHomeworkById, [studentHomeworkId]);
        const studentHomework = row[0];

        return NextResponse.json({message: "Success", studentHomework}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
}