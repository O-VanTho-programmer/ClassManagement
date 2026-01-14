import pool from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const permissionCheck = await checkPermission(req, 'EDIT_FACE_AUTH_HOMEWORK', body.hub_id);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const {assignment_id, enabled} = body;

        const queryUpdateAssignmentSecurity = `
            UPDATE class_homework
            SET IsFaceAuthEnabled = ?
            WHERE ClassHomeworkId = ?
        `;

        const [result] = await pool.query(queryUpdateAssignmentSecurity, [enabled, assignment_id]);
        return NextResponse.json({ message: "Success", result }, { status: 200 });

    } catch (error) {
        console.error("Failed to update assignment security:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}