import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { teacherId, hubId, role } = await req.json();

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