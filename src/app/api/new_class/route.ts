import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      teacher,
      assistant,
      subject,
      schedule,
      tuition,
      tuitionType,
      base,
      status,
      startDate,
      endDate,
    } = body;

    if (!name || !teacher || !subject || !tuitionType || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ✅ Find teacher ID
    const [teacherRows]: any = await pool.query(
      `SELECT UserId FROM user WHERE Name = ? LIMIT 1`,
      [teacher]
    );

    if (!teacherRows.length) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    const teacherId = teacherRows[0].UserId;

    let assistantId = null;
    if (assistant) {
      const [assistantRows]: any = await pool.query(
        `SELECT UserId FROM user WHERE Name = ? LIMIT 1`,
        [assistant]
      );
      if (assistantRows.length) assistantId = assistantRows[0].UserId;
    }

    const [classResult]: any = await pool.query(
      `INSERT INTO class 
        (Name, StartDate, EndDate, Teacher, Assistant, Subject, Tuition, TuitionType, Base, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        startDate,
        endDate,
        teacherId,
        assistantId,
        subject,
        tuition ?? null,
        tuitionType,
        base ?? null,
        status ?? "active",
      ]
    );

    const classId = classResult.insertId;

    const scheduleSql = `
      INSERT INTO schedule (DaysOfWeek, StartTime, EndTime, ClassId)
      VALUES (?, ?, ?, ?)
    `;

    for (const s of schedule) {
      const [startTime, endTime] = s.time.split(" - ").map((t:string) => t.trim());
      await pool.query(scheduleSql, [s.day, startTime, endTime, classId]);
    }

    return NextResponse.json({
      id: classId,
      message: "Class and schedules created successfully",
    });

  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
