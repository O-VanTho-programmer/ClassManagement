import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classHomeworkId = searchParams.get("class_homework_id");

        if (!classHomeworkId) {
            return NextResponse.json(
                { message: "classHomeworkId is required" },
                { status: 400 }
            );
        }

        const queryDeleteClassHomework = `
            DELETE FROM class_homework
            WHERE ClassHomeworkId = ${classHomeworkId};
        `;

        const [result] = await pool.query(queryDeleteClassHomework);

        return NextResponse.json(
            { message: "Homework is unassigned from class successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error unassigning homework from class: ", error);
        return NextResponse.json(
            { message: "Error unassigning homework from class" },
            { status: 500 }
        );
    }
}