import pool from "@/lib/db";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("class_id");
        const hubId = searchParams.get("hub_id");

        if (!classId) {
            return NextResponse.json(
                { message: "classId is required" },
                { status: 400 }
            );
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.DELETE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const deleteClassByIdQuery = `
            DELETE FROM class
            WHERE ClassId = ?
        `;

        const [result] = await pool.query(deleteClassByIdQuery, [classId]);

        return NextResponse.json({ message: "Class deleted successfully", result }, { status: 200 });

    } catch (error) {
        console.error("Error deleting class: ", error);
        return NextResponse.json(
            { message: "Error deleting class" },
            { status: 500 }
        );
    }
}