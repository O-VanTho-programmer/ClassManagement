import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
  let connection: PoolConnection | undefined;

  try {
    const body = await req.json();    
    // Check permission
    const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_CLASS, body.hubId, body);
    if (permissionCheck instanceof NextResponse) {
      return permissionCheck;
    }

    const { user } = permissionCheck;
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
      hubId
    } = body;

    if (!name || !teacher || !subject || !tuitionType || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return NextResponse.json({ message: "Schedule is required and must have at least one time slot" }, { status: 400 });
    }

    for (const s of schedule) {
      if (!s.day || !s.startTime || !s.endTime) {
        return NextResponse.json({ message: "Each schedule item must have day, startTime, and endTime" }, { status: 400 });
      }
    }

    const assistantId = (assistant && assistant) || null;
    const tuitionValue = (tuition && tuition) || null;
    const baseValue = (base && base) || null;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [classResult]: any = await connection.query(
      `INSERT INTO class 
        (Name, StartDate, EndDate, TeacherUserId, AssistantUserId, Subject, Tuition, TuitionType, Base, Status, HubId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        startDate,
        endDate,
        teacher,
        assistantId,
        subject,
        tuitionValue,
        tuitionType,
        baseValue,
        status ?? "active",
        hubId
      ]
    );

    const classId = classResult.insertId;

    const scheduleSql = `
      INSERT INTO schedule (DaysOfWeek, StartTime, EndTime, ClassId)
      VALUES (?, ?, ?, ?)
    `;

    for (const s of schedule) {
      await connection.query(scheduleSql, [s.day, s.startTime, s.endTime, classId]);
    }

    await connection.commit();

    return NextResponse.json({
      id: classId,
      message: "Class and schedules created successfully",
    });

  } catch (error) {
    console.error("Error creating class:", error);
    if (connection) await connection.rollback();
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
