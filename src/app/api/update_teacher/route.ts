import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function PUT(req: Request) {
    try {
        const { teacher, hubId } = await req.json();
        
        // Check permission - need EDIT_MEMBER to update teacher info
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_MEMBER, hubId, { hubId });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const {
            id,
            name,
            email,
            phone,
            address
        } = teacher;

        if (!id || !hubId) {
            return NextResponse.json({ message: "Missing required fields: teacherId, hubId, or role" }, { status: 400 });
        }

        const queryUpdateTeacher = `
            UPDATE teachers
            SET Name = ?, Email = ?, Phone = ?, Address = ?
            WHERE UserId = ?
        `
        const [result] = await pool.query(queryUpdateTeacher, [name, email, phone, address, id]);

        return NextResponse.json({ message: "Teacher data updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("Error updating teacher role:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
    }
}