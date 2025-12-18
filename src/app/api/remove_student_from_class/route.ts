import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    try {
        const {studentId, classId} = await req.json();

        if (!studentId || !classId) {
            throw new Error("Missing studentId or classId");
        }

        const queryRemoveStudentFromClass = `
            DELETE FROM class_student
            WHERE ClassId = ? AND StudentId = ?
        `;

        const [row] = await pool.query(queryRemoveStudentFromClass, [classId, studentId]);

        return NextResponse.json({message: "Success", row}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500})
    }
}