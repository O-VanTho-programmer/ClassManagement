import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentHomeworkId = searchParams.get("studentHomeworkId");

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