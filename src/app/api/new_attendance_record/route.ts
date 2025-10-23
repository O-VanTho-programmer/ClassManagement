import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { newRecord, classId } = await req.json();
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
        } = newRecord;

        const [studentRow]: any[] = await pool.query(`
            SELECT * FROM student WHERE StudentId = ? AND Name = ?
            LIMIT 1
        `, [id, name])

        if (studentRow.length === 0) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const dateType = new Date(date);

        const queryNewAttendanceRecord = `
        INSERT INTO record_attendance (Present, Score, IsFinishHomework, Commemt, CreatedDate, StudentId, ClassId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `
        await pool.query(queryNewAttendanceRecord, [present, score, is_finished_homework, comment, dateType, id, classId]);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}