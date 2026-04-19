import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId, grade, feedback, questions, isGradedByAI, isReadable } = await req.json();

        // isReadable === false means the AI flagged this as blurry/unreadable
        const isUnreadable = isReadable === false;

        if (!studentHomeworkId || (!isUnreadable && (grade === undefined || grade === null || !feedback || !questions))) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

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

        // Check permission - need GRADE_HOMEWORK permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.GRADE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        if (isUnreadable) {
            // Image is unreadable: flag the submission for manual review, do NOT save grade
            await connection.query(`
                UPDATE student_homework 
                SET Status = 'NeedsReview', IsGradedByAI = 1, IsGraded = 0
                WHERE StudentHomeworkId = ?
            `, [studentHomeworkId]);

            await connection.commit();
            return NextResponse.json({ message: "Submission flagged for manual review due to unreadable image" }, { status: 200 });
        }

        // Image is readable: save grade normally
        // If graded by AI, set Status = 'GradeAI'; otherwise set Status = 'Graded'
        const newStatus = isGradedByAI ? 'GradeAI' : 'Graded';
        const gradedByAIValue = isGradedByAI ? 1 : 0;

        await connection.query(`
            UPDATE student_homework 
            SET Grade = ?, Feedback = ?, IsGraded = 1, Status = ?, IsGradedByAI = ?
            WHERE StudentHomeworkId = ?
        `, [grade, feedback, newStatus, gradedByAIValue, studentHomeworkId]);

        if (Array.isArray(questions) && questions.length > 0) {
            await connection.query(
                `DELETE FROM student_homework_question WHERE StudentHomeworkId = ?`,
                [studentHomeworkId]
            );

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