import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function POST(req: Request) {
    try {
        const {
            hub_id,
            title,
            content,
            created_by_user_id
        } = await req.json();
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_HOMEWORK, hub_id, { hub_id });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

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