import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {homeworkId, answerKey} = await req.json();

        const querySaveAnswerKeyHomework = `
            UPDATE homework
            SET AnswerKey = ?
            WHERE HomeworkId = ?
        `;

        const [result] = await pool.query(querySaveAnswerKeyHomework, [answerKey, homeworkId]);

        return NextResponse.json({message: "Success", result}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500})
    }
}