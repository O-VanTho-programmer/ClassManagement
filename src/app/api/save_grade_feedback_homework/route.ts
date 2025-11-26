import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { studentHomeworkId, grade, feedback } = await req.json();

        const querySaveGradeFeedbackSubmission = `
            UPDATE student_homework 
            SET Grade = ?, Feedback = ?, IsGraded = 1
            WHERE StudentHomeworkId = ?
        `;

        const [result] = await pool.query(querySaveGradeFeedbackSubmission, [grade, feedback, studentHomeworkId]);
        
        return NextResponse.json({ message: "Success", result }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 })
    }
}