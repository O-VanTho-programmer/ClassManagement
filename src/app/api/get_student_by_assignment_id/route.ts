import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const assignmentId = searchParams.get("assignmentId");

        const queryGetStudentByAssignmentId = `
            SELECT  
                s.StudentId AS id,
                s.Name AS name,
                s.DateOfBirth AS birthday,
                s.Status AS status,
                sh.StudentHomeworkId AS student_homework_id,
                sh.Status AS homework_status,
                sh.SubmittedDate AS submitted_date
            FROM student_homework sh
            JOIN student s ON sh.StudentId = s.StudentId
            WHERE sh.ClassHomeworkId = ?
        `;

        const [studentList] : any[] = await pool.query(queryGetStudentByAssignmentId, [assignmentId]);

        return NextResponse.json({message: "Success", studentList}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
}