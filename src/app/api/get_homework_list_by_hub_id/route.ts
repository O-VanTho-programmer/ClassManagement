import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");
        const classId = searchParams.get("classId");

        const query =`
            SELECT 
                h.HomeworkId as id,
                h.HubId as hub_id,
                h.Title as title,
                h.Content as content,
                DATE_FORMAT(h.CreatedDate, '%m/%d/%Y') as created_date,
                h.CreatedByUserId as created_by_user_id,
                u.name AS created_by_user_name
            FROM homework h
            JOIN user u ON u.UserId = h.CreatedByUserId
            WHERE h.HubId = ?
            ORDER BY h.CreatedDate DESC
        `

        const [homeworkList] = await pool.query(query, [hubId]);

        return NextResponse.json({ message: 'Success', homeworkList }, { status: 200 });
    } catch (error) {
        console.log("Error with get homework list api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}