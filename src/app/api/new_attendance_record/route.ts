import pool from "@/lib/db";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { newRecord, classId } = await req.json();
        
        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.TAKE_ATTENDANCE, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }
        
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

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [studentRow]: any[] = await connection.query(`
            SELECT * FROM student WHERE StudentId = ? AND Name = ?
            LIMIT 1
        `, [id, name])

        if (studentRow.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const dateString = formatDateForCompare(date);

        const attendanceRecordExistQuery = `
            SELECT * FROM record_attendance WHERE StudentId = ? AND AttendanceDate = ?
            LIMIT 1;
        `;

        const [attendanceRecordExits]: any[] = await connection.query(attendanceRecordExistQuery, [id, dateString]);

        if (attendanceRecordExits.length > 0) { 
            const attendanceRecordId = attendanceRecordExits[0].RecordAttendanceId;

            const queryUpdateAttendanceRecord = `
                UPDATE record_attendance
                SET Present = ?, Score = ?, Comment = ?, UpdatedDate = NOW()
                WHERE RecordAttendanceId = ?
            `;
            
            await connection.query(queryUpdateAttendanceRecord, [present, score, comment, attendanceRecordId]);
        } else {
            const queryNewAttendanceRecord = `
                INSERT INTO record_attendance (Present, Score, Comment, AttendanceDate, StudentId, ClassId)
                VALUES (?, ?, ?, ?, ?, ?)
            `

            await connection.query(queryNewAttendanceRecord, [present, score, comment, dateString, id, classId]);
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