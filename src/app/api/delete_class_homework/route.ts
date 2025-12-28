import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classHomeworkId = searchParams.get("class_homework_id");

        if (!classHomeworkId) {
            return NextResponse.json(
                { message: "classHomeworkId is required" },
                { status: 400 }
            );
        }
        
        // Get hubId from classHomeworkId
        const [classHomework]: any[] = await pool.query(`
            SELECT ch.ClassId, h.HubId 
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.ClassHomeworkId = ?
        `, [classHomeworkId]);
        
        if (classHomework.length === 0) {
            return NextResponse.json({ message: "Class homework not found" }, { status: 404 });
        }
        
        const hubId = classHomework[0].HubId;
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.ASSIGN_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryDeleteClassHomework = `
            DELETE FROM class_homework
            WHERE ClassHomeworkId = ${classHomeworkId};
        `;

        const [result] = await pool.query(queryDeleteClassHomework);

        return NextResponse.json(
            { message: "Homework is unassigned from class successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error unassigning homework from class: ", error);
        return NextResponse.json(
            { message: "Error unassigning homework from class" },
            { status: 500 }
        );
    }
}