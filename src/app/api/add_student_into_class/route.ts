import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {studentId, classId} = await req.json();


        const queryAddStudentIntoClass = `
            INSERT INTO class_student (ClassId, StudentId)
            VALUES (?, ?)
        `;

        await pool.query(queryAddStudentIntoClass, [classId, studentId]);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}