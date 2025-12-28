import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
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

        const queryGetHomeworkById = `
            SELECT 
                h.HomeworkId as id,
                h.HubId as hub_id,
                h.Title as title,
                h.Content as content,
                h.AnswerKey as answer_key,
                DATE_FORMAT(h.CreatedDate, '%m/%d/%Y') as created_date,
                h.CreatedByUserId as created_by_user_id,
                u.name AS created_by_user_name
            FROM homework h
            JOIN user u ON u.UserId = h.CreatedByUserId
            WHERE h.HomeworkId = ?
            ORDER BY h.CreatedDate DESC
            LIMIT 1;
        `;

        const [row] : any[] = await pool.query(queryGetHomeworkById, [homeworkId]);

        const homework = row[0];

        return NextResponse.json({message: "Success", homework}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error", error}, {status: 500});
    }
}