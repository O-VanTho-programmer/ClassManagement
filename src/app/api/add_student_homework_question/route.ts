import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let connection;
    try {
        const { studentHomeworkId, questions } = await req.json();

        if (!studentHomeworkId || !questions) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM student_homework_question WHERE StudentHomeworkId = ?`,
            [studentHomeworkId]
        );

        // 3. Bulk Insert new question grades
        if (Array.isArray(questions) && questions.length > 0) {
            const values = questions.map((q: StudentHomeworkQuestionsInputDTO) => [
                studentHomeworkId,
                q.question_number,
                q.grade,
                q.max_grade,
                q.feed_back
            ]);

            await connection.query(
                `INSERT INTO student_homework_question 
                (StudentHomeworkId, QuestionNumber, Grade, MaxGrade, FeedBack) 
                VALUES ?`,
                [values]
            );
        }

        await connection.commit();

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error: any) {
        if (connection) await connection.rollback();
        
        console.error("Save Questions Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}