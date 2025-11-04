import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {
            homework_id,
            class_ids,
            assigned_date,
            due_date,
        } = await req.json();

        const queryAssignHomework = `
            INSERT INTO class_homework 
            (ClassId, HomeworkId, DueDate, AssignedDate) 
            VALUES (?, ?, ?, ?) 
        `

        for (const classId of class_ids) {
            await pool.query(queryAssignHomework, [classId, homework_id, due_date, assigned_date]);
        }

        return NextResponse.json({ message: "Success" }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}