import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId, questions } = await req.json();
        
        if (!studentHomeworkId || !questions) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Get hubId from studentHomeworkId
        const [studentHomework]: any[] = await connection.query(`
            SELECT h.HubId 
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);
        
        if (studentHomework.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }
        
        const hubId = studentHomework[0].HubId;
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.GRADE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        await connection.query(
            `DELETE FROM student_homework_question WHERE StudentHomeworkId = ?`,
            [studentHomeworkId]
        );

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