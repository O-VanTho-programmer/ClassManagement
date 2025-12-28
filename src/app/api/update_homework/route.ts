import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function PUT(req:Request) {
    try {
        const {title, content, homeworkId} = await req.json();
        
        // Get hubId from homeworkId and check permission
        const hubId = await getHubIdFromHomeworkId(homeworkId);
        if (!hubId) {
            return NextResponse.json({ message: "Homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryUpdateHomework = `
            UPDATE homework
            SET Title = ?, Content = ?, UpdatedDate = NOW()
            WHERE HomeworkId = ?
        `;

        const [result] = await pool.query(queryUpdateHomework, [title, content, homeworkId]);
        
        return NextResponse.json({ message: "Homework data updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("Error updating homework:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    
    }
}