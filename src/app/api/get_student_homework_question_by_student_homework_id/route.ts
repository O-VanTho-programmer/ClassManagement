import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classHomeworkId = searchParams.get("classHomeworkId");

        const getStudentHomeworkQuestionByStudentHomeworkId = `
            SELECT     
                s.StudentId as student_id, 
                s.Name as student_name,
                sh.StudentHomeworkId as student_homework_id,
                sh.Grade as total_score,
                COALESCE(sh.Status, 'Pending') as status,
                sh.Feedback as feedback,
                -- Aggregate questions into a JSON array
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'student_homework_question_id', shq.StudentHomeworkQuestionId,
                        'question_number', shq.QuestionNumber,
                        'grade', shq.Grade,
                        'max_grade', shq.MaxGrade
                    )
                ) AS questions_json
            FROM class_homework ch
            JOIN class_student cs ON cs.ClassId = ch.ClassId
            JOIN student s ON s.StudentId = cs.StudentId
            LEFT JOIN student_homework sh ON sh.ClassHomeworkId = ch.ClassHomeworkId AND sh.StudentId = s.StudentId
            LEFT JOIN student_homework_question shq ON shq.StudentHomeworkId = sh.StudentHomeworkId
            WHERE ch.ClassHomeworkId = 3
            GROUP BY s.StudentId, s.Name, sh.Grade, sh.Status, sh.Feedback
            ORDER BY s.Name ASC;
        `;

        const [rows]: any[] = await pool.query(getStudentHomeworkQuestionByStudentHomeworkId, classHomeworkId);

        const gradeBooks = rows.map((row: any) => {
            let question = row.questions_json;

            if (typeof question === 'string') {
                question = JSON.parse(question);
            }

            const validQuestion = question.filter((q: any) => q && q.question_number !== null);
            validQuestion.sort((a: any, b: any) => a.question_number - b.question_number);

            return {
                student_id: row.student_id,
                student_name: row.student_name,
                total_score: row.total_score,
                homework_status: row.status,
                feedback: row.feedback,
                questions: validQuestion
            }
        })

        let total_question = 0;

        for (const gradeBook of gradeBooks) {
            if (total_question < gradeBook.questions.length) {
                total_question = gradeBook.questions.length;
            }
        }

        return NextResponse.json({
            message: "Success",
            total_question: total_question || 5,
            students_homework_questions: gradeBooks
        }, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}