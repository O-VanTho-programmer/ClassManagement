import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function DELETE(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { searchParams } = new URL(req.url);
        const homeworkId = searchParams.get("homeworkId");

        if (!homeworkId) {
            return NextResponse.json(
                { message: "homeworkId is required" },
                { status: 400 }
            );
        }
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Get hubId from homeworkId and check permission
        const hubId = await getHubIdFromHomeworkId(homeworkId);
        if (!hubId) {
            await connection.rollback();
            return NextResponse.json({ message: "Homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.DELETE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        // Get all class_homework IDs related to this homework
        const [classHomeworkRows]: any[] = await connection.query(
            `SELECT ClassHomeworkId FROM class_homework WHERE HomeworkId = ?`,
            [homeworkId]
        );

        const classHomeworkIds = classHomeworkRows.map((row: any) => row.ClassHomeworkId);

        // Delete related student_homework records
        if (classHomeworkIds.length > 0) {
            await connection.query(
                `DELETE FROM student_homework WHERE ClassHomeworkId IN (?)`,
                [classHomeworkIds]
            );
        }

        // Delete related class_homework records
        await connection.query(
            `DELETE FROM class_homework WHERE HomeworkId = ?`,
            [homeworkId]
        );

        // Delete the homework record
        await connection.query(
            `DELETE FROM homework WHERE HomeworkId = ?`,
            [homeworkId]
        );

        await connection.commit();

        return NextResponse.json(
            { message: "Homework deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting homework:", error);
        if (connection) await connection.rollback();
        return NextResponse.json(
            { message: "Error deleting homework" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}