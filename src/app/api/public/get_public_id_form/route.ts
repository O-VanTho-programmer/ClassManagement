import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const assignment_id = searchParams.get("assignment_id");

        const queryGetPublicIdFormByAssignmentId = `
            SELECT PublicIdForm FROM class_homework WHERE ClassHomeworkId = ?;
        `;

        const [publicIdFormRows]: any[] = await pool.query(queryGetPublicIdFormByAssignmentId, [assignment_id]);

        return NextResponse.json({ message: "Success", publicIdForm: publicIdFormRows[0].PublicIdForm }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}