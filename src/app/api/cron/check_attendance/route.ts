import pool from "@/lib/db";
import { dayNames } from "@/utils/dayNames";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    //Prevent Unauthroised
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const today = new Date();
        const curDayOfWeek = dayNames[today.getDay()];
        const todayDateString = formatDateForCompare(today);

        //Get students who are in classes scheduled today but dont have attendance records for today
        const getAbsentStudents = `
            SELECT 
                cs.ClassId,
                cs.StudentId
            FROM class_student cs
            WHERE cs.ClassId IN (SELECT ClassId FROM schedule WHERE DayOfWeek = ?)
            AND NOT EXISTS (
                SELECT 1 
                FROM record_attendance ra 
                WHERE ra.StudentId = cs.StudentId 
                AND ra.ClassId = cs.ClassId 
                AND ra.AttendanceDate = ?
            )
        `;

        const [absentStudents]: any[] = await connection.query(
            getAbsentStudents, 
            [curDayOfWeek, todayDateString]
        );

        if (absentStudents.length > 0) {

            const insertAttendanceRecord = `
                INSERT INTO record_attendance (Present, AttendanceDate, StudentId, ClassId, CreatedDate)
                VALUES (?, ?, ?, ?, NOW())
            `;

            for (const student of absentStudents) {
                await connection.query(insertAttendanceRecord, [
                    'Absent', 
                    todayDateString,
                    student.StudentId,
                    student.ClassId
                ]);
            }
        }

        await connection.commit();
        return NextResponse.json({
            message: "Success",
            absentCount: absentStudents.length
        }, { status: 200 });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error in check_attendance cron:", error);
        return NextResponse.json({"message": "Something went wrong"}, {status: 500});
    } finally {
        if (connection) {
            connection.release();
        }
    }
}