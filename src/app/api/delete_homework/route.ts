import pool from "@/lib/db";
import { NextResponse } from "next/server";

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