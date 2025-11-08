import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { class_homework_id, due_date, assigned_date } = await req.json();

        const updateClassHomeworkDateQuery = `
            UPDATE class_homework
            SET DueDate = ?, AssignedDate = ?
            WHERE ClassHomeworkId = ?;
        `;

        const [result] = await pool.query(updateClassHomeworkDateQuery, [due_date, assigned_date, class_homework_id]);

        return  NextResponse.json({ message: "Success", result }, { status: 200 });
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}