import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const homeworkId = searchParams.get("homeworkId");

        if (!homeworkId) {
            return NextResponse.json(
                { message: "homeworkId is required" },
                { status: 400 }
            );
        }
        
        // Get hubId from homeworkId and check permission
        const hubId = await getHubIdFromHomeworkId(homeworkId);
        if (!hubId) {
            return NextResponse.json({ message: "Homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.DELETE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryDeleteHomework = `
            DELETE FROM homework
            WHERE HomeworkId = ${homeworkId};
        `;

        const [result] = await pool.query(queryDeleteHomework);

        return NextResponse.json(
            { message: "Homework deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting homework:", error);
        return NextResponse.json(
            { message: "Error deleting homework" },
            { status: 500 }
        );
    }
}