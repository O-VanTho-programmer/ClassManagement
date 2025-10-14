import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        const queryGetStudentAttendanceRecords = `
        SELECT 
            s.StudentId AS id,
            s.Name AS name,
            s.DateOfBirth as birthday,
            s.EnrollDate as enroll_date,
            s.Status as status,
            rd.Present as present,
            rd.Score as score,
            rd.IsFinishHomework as is_finished_homework,
            rd.Commemt as comment,
            rd.CreatedDate as date
        FROM record_attendance AS rd
        JOIN student s ON s.StudentId = rd.StudentId
        WHERE rd.ClassId = ?
        ORDER BY rd.CreatedDate DESC;
        `;

        const [rows] = await pool.query(queryGetStudentAttendanceRecords, [classId]);

        const studentsMap = new Map<string, StudentWithAttendanceRecordList>();

        type tempType = StudentAttendance & Student

        for(const row of rows as tempType[]){
            if(!studentsMap.has(row.id)){
                studentsMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    birthday: row.birthday,
                    enroll_date: row.enroll_date,
                    status: row.status,
                    records: []
                });
            }

            let curStudent = studentsMap.get(row.id);

            curStudent?.records.push({
                present: row.present,
                score: row.score,
                is_finished_homework: row.is_finished_homework,
                comment: row.comment,
                date: row.date,
            });
        }
        
        
        return NextResponse.json(Array.from(studentsMap.values()));
    } catch (error) {
        console.log("Error with get attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}