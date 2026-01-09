import pool from "@/lib/db";
import { checkPermission } from "@/lib/permissions";
import { NextResponse } from "next/server";
import type { PoolConnection } from "mysql2/promise";

export async function PUT(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const body = await req.json();
        const permissionCheck = await checkPermission(req, 'EDIT_CLASS', body.hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }
        const { user } = permissionCheck;

        const {
            id,
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

        const queryUpdateClassInfo = `
            UPDATE class
            SET Name = ?, StartDate = ?, EndDate = ?, TeacherUserId = ?, AssistantUserId = ?, Subject = ?, Tuition = ?, TuitionType = ?, Base = ?, Status = ?
            WHERE ClassId = ? AND HubId = ?
        `;

        await connection.query(queryUpdateClassInfo, [
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
            id,
            hubId
        ]);

        // Delete existing schedules and insert new ones
        await connection.query(
            `DELETE FROM schedule WHERE ClassId = ?`,
            [id]
        );

        const scheduleSql = `
            INSERT INTO schedule (DaysOfWeek, StartTime, EndTime, ClassId)
            VALUES (?, ?, ?, ?)
        `;

        for (const s of schedule) {
            await connection.query(scheduleSql, [s.day, s.startTime, s.endTime, id]);
        }

        await connection.commit();

        return NextResponse.json({
            id: id,
            message: "Class updated successfully",
        }, {status: 200});
    } catch (error) {
        console.error("Error updating class:", error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}