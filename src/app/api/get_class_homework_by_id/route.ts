import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const assignmentId = searchParams.get("assignmentId");
        
        // Get hubId from assignmentId (classHomeworkId)
        const [classHomework]: any[] = await pool.query(`
            SELECT h.HubId 
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.ClassHomeworkId = ?
        `, [assignmentId]);
        
        if (classHomework.length === 0) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }
        
        const hubId = classHomework[0].HubId;
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        if (!assignmentId) {
            return NextResponse.json({ message: "Assignment Id is required" }, { status: 400 });
        } 

        const queryGetAssignmentById = `
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
            WHERE ch.ClassHomeworkId = ?
        `;

        const [row] : any[] = await pool.query(queryGetAssignmentById, [assignmentId]);

        const class_homework = row[0];

        return NextResponse.json({message: 'success', class_homework}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}