import pool from "@/lib/db";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { newRecords, classId } = await req.json() as { newRecords: StudentAttendance[], classId: string };

        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.TAKE_ATTENDANCE, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const newRecord of newRecords) {

            const {
                // Student
                id,
                name,
                // 
                // Record Attendance
                present,
                score,
                // is_finished_homework,
                comment,
                date,
            } = newRecord;


            const dateString = formatDateForCompare(date);

            const queryUpsertRecordAttendance = `
                INSERT INTO record_attendance (StudentId, AttendanceDate, ClassId, Present, Score, Comment)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    Present = VALUES(Present),
                    Score = VALUES(Score),
                    Comment = VALUES(Comment),
                    UpdatedDate = NOW();
            `;

            await connection.query(queryUpsertRecordAttendance, [id, dateString, classId, present, score, comment]);
        }

        await connection.commit();

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}