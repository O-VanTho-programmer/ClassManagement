import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId } = await req.json();

        if (!studentHomeworkId) {
            return NextResponse.json({ message: "Missing studentHomeworkId" }, { status: 400 });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [studentHomework]: any[] = await connection.query(`
            SELECT h.HubId, sh.Status
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

        // Only allow approval if currently GradeAI
        if (studentHomework[0].Status !== 'GradeAI') {
            await connection.rollback();
            return NextResponse.json({ message: "Submission is not pending AI grade approval" }, { status: 400 });
        }

        await connection.query(`
            UPDATE student_homework 
            SET Status = 'Graded', IsGradedByAI = 0, IsGraded = 1
            WHERE StudentHomeworkId = ?
        `, [studentHomeworkId]);

        await connection.commit();

        return NextResponse.json({ message: "AI grade approved successfully" }, { status: 200 });

    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error("Approve AI Grade Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
