import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function PUT(req: Request) {
    try {
        const { teacherId, hubId, role } = await req.json();
        
        // Check permission - need EDIT_MEMBER to update teacher roles
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_MEMBER, hubId, { hubId });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        if (!teacherId || !hubId || !role) {
            return NextResponse.json({ message: "Missing required fields: teacherId, hubId, or role" }, { status: 400 });
        }

        const queryUpdateTeacherRole = `
            UPDATE hub_role
            SET Role = ?
            WHERE HubId = ? AND UserId = ?
        `;

        const [result] = await pool.query(queryUpdateTeacherRole, [role, hubId, teacherId]);

        return NextResponse.json({ message: "Teacher role updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("[UPDATE_TEACHER_ROLE_ERROR]", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
    }
}