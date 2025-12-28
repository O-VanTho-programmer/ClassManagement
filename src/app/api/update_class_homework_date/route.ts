import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function PUT(req: Request) {
    try {
        const { class_homework_id, due_date, assigned_date } = await req.json();
        
        // Get hubId from classHomeworkId
        const [classHomework]: any[] = await pool.query(`
            SELECT h.HubId 
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.ClassHomeworkId = ?
        `, [class_homework_id]);
        
        if (classHomework.length === 0) {
            return NextResponse.json({ message: "Class homework not found" }, { status: 404 });
        }
        
        const hubId = classHomework[0].HubId;
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.ASSIGN_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const updateClassHomeworkDateQuery = `
            UPDATE class_homework
            SET DueDate = ?, AssignedDate = ?
            WHERE ClassHomeworkId = ?;
        `;

        const [result] = await pool.query(updateClassHomeworkDateQuery, [due_date, assigned_date, class_homework_id]);

        return  NextResponse.json({ message: "Success", result }, { status: 200 });
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}