import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function DELETE(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { searchParams } = new URL(req.url);
        const classHomeworkId = searchParams.get("class_homework_id");

        if (!classHomeworkId) {
            return NextResponse.json(
                { message: "classHomeworkId is required" },
                { status: 400 }
            );
        }
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Get hubId from classHomeworkId
        const [classHomework]: any[] = await connection.query(`
            SELECT ch.ClassId, h.HubId 
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.ClassHomeworkId = ?
        `, [classHomeworkId]);
        
        if (classHomework.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Class homework not found" }, { status: 404 });
        }
        
        const hubId = classHomework[0].HubId;
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.DELETE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        // Delete related student_homework records first (cascade delete should handle this, but being explicit)
        await connection.query(
            `DELETE FROM student_homework WHERE ClassHomeworkId = ?`,
            [classHomeworkId]
        );

        // Delete the class_homework record
        await connection.query(
            `DELETE FROM class_homework WHERE ClassHomeworkId = ?`,
            [classHomeworkId]
        );

        await connection.commit();

        return NextResponse.json(
            { message: "Homework is unassigned from class successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error unassigning homework from class: ", error);
        if (connection) await connection.rollback();
        return NextResponse.json(
            { message: "Error unassigning homework from class" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}