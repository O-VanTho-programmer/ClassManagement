import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { body } = await req.json();
        const {
            // Student
            id,
            name,
            // 
            // Record Attendance
            present,
            score,
            is_finished_homework,
            comment,
            date,
            classId
            // 
        } = body;

        const [studentRow]: any[] = await pool.query(`
        SELECT * FROM student WHERE StudentId = ?
        LIMIT 1
    `, [id])

        const queryNewAttendanceRecord = `
        INSERT INTO record_attendance (Present, Score, IsFinishHomework Commemt, CreatedDate, StudentId, ClassId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `
        await pool.query(queryNewAttendanceRecord, [present, score, is_finished_homework, comment, date, studentRow[0].StudentId, classId]);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}