import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        const queryGetHomeworkListByClassId = `
            SELECT 
                ch.ClassHomeworkId as class_homework_id,
                ch.ClassId as class_id,
                ch.HomeworkId as homework_id,
                h.Title as title,
                h.Content as content,
                DATE_FORMAT(ch.DueDate, '%m/%d/%Y') as due_date,
                DATE_FORMAT(ch.AssignedDate, '%m/%d/%Y') as assigned_date,
                u.Name as created_by_user_name
            FROM class_homework ch
            JOIN homework h ON h.HomeworkId = ch.HomeworkId
            JOIN User u ON u.UserId = h.CreatedByUserId
            WHERE ch.ClassId = ?
            ORDER BY ch.DueDate ASC;    
        `;

        const [homeworkList] = await pool.query(queryGetHomeworkListByClassId, [classId]);
        return NextResponse.json({message:"Success", homeworkList }, {status: 200});
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({message: "Internal Server Error", error}, {status: 500});
    }
}