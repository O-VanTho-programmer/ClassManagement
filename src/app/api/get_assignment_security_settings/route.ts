import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const assignment_id = searchParams.get("assignment_id");

    if (!assignment_id) {
        return NextResponse.json({ message: "assignment_id is required" }, { status: 400 });
    }

    try {
        const queryGetAssignmentSecuritySettings = `
            SELECT ClassHomeworkId as class_homework_id, IsFaceAuthEnabled as is_face_auth_enabled
            FROM class_homework
            WHERE ClassHomeworkId = ?
        `;

        const [classHomeworkRows]: any[] = await pool.query(queryGetAssignmentSecuritySettings, [assignment_id]);

        if (classHomeworkRows.length === 0) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        const classHomework = classHomeworkRows[0];

        return NextResponse.json({ message: "Success", classHomework }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch assignment security settings by assignment_id:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}