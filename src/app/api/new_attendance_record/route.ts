import pool from "@/lib/db";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function POST(req: Request) {
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

        const [studentRow]: any[] = await pool.query(`
            SELECT * FROM student WHERE StudentId = ? AND Name = ?
            LIMIT 1
        `, [id, name])

        if (studentRow.length === 0) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const dateString = formatDateForCompare(date);

        const attendanceRecordExistQuery = `
            SELECT * FROM record_attendance WHERE StudentId = ? AND AttendanceDate = ?
            LIMIT 1;
        `;

        const [attendanceRecordExits]: any[] = await pool.query(attendanceRecordExistQuery, [id, dateString]);

        if (attendanceRecordExits.length > 0) { 
            const attendanceRecordId = attendanceRecordExits[0].RecordAttendanceId;

            const queryUpdateAttendanceRecord = `
                UPDATE record_attendance
                SET Present = ?, Score = ?, Comment = ?, UpdatedDate = NOW()
                WHERE RecordAttendanceId = ?
            `;
            
            const [res] = await pool.query(queryUpdateAttendanceRecord, [present, score, comment, attendanceRecordId])
            console.log(res);
        } else {
            const queryNewAttendanceRecord = `
                INSERT INTO record_attendance (Present, Score, Comment, AttendanceDate, StudentId, ClassId)
                VALUES (?, ?, ?, ?, ?, ?)
            `

            await pool.query(queryNewAttendanceRecord, [present, score, comment, dateString, id, classId]);
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}