import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const homeworkId = searchParams.get("homeworkId");
        
        // Get hubId from homeworkId and check permission
        const hubId = await getHubIdFromHomeworkId(homeworkId || "");
        if (!hubId) {
            return NextResponse.json({ message: "Homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        if (!homeworkId) {
            return NextResponse.json({ message: "Homework Id is required" }, { status: 400 });
        } 

        const queryGetClassHomeworkByHomeworkId = `
            SELECT 
                ch.ClassHomeworkId as class_homework_id,
                ch.ClassId as class_id,
                ch.HomeworkId as homework_id,
                c.Name as class_name,
                h.Title as title,
                h.Content as content,
                DATE_FORMAT(ch.DueDate, '%m/%d/%Y') as due_date,
                DATE_FORMAT(ch.AssignedDate, '%m/%d/%Y') as assigned_date,
                u.Name as created_by_user_name
            FROM class_homework ch
            JOIN homework h ON h.HomeworkId = ch.HomeworkId
            JOIN class c ON c.classId = ch.ClassId
            JOIN user u ON u.UserId = h.CreatedByUserId
            WHERE ch.HomeworkId = ?
        `;

        const [class_homework] : any[] = await pool.query(queryGetClassHomeworkByHomeworkId, [homeworkId]);

        return NextResponse.json({message: 'success', class_homework}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}