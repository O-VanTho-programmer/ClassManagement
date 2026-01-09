import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId, grade, feedback } = await req.json();

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
        
        // Check permission - need GRADE_HOMEWORK permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.GRADE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        const querySaveGradeFeedbackSubmission = `
            UPDATE student_homework 
            SET Grade = ?, Feedback = ?, IsGraded = 1
            WHERE StudentHomeworkId = ?
        `;

        const [result] = await connection.query(querySaveGradeFeedbackSubmission, [grade, feedback, studentHomeworkId]);
        
        await connection.commit();
        return NextResponse.json({ message: "Success", result }, { status: 200 })
    } catch (error) {
        console.log(error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Error", error }, { status: 500 })
    } finally {
        if (connection) connection.release();
    }

}