import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {
            hub_id,
            title,
            content,
            created_by_user_id
        } = await req.json();

        const query = `
        INSERT INTO homework (HubId, Title, Content, CreatedByUserId)
        VALUES (? , ?, ?, ?);
        `;

        await pool.query(query, [hub_id, title, content, created_by_user_id]);

        return NextResponse.json({message: "Success"}, {status: 200});
    } catch (error) {
        console.error("Error creating homework:", error);
        return NextResponse.json({ message: "Create homework failed" }, { status: 500 });
    }
}