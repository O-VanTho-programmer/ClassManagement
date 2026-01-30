import pool from "@/lib/db";
import { Schedule } from "@/types/Schedule";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import generateDateRange from "@/utils/generateDateRange";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId || "");
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_ATTENDANCE, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }
        const schedule = searchParams.get("schedule");

        if (!classId || !schedule) {
            return;
        }

        const scheduleObj = JSON.parse(schedule) as Schedule[];

        // FETCH ATTENDANCE RECORDS
        const attendanceQuery = `
        SELECT 
            s.StudentId AS id,
            s.Name AS name,
            s.DateOfBirth as birthday,
            s.Status as status,
            rd.Present as present,
            rd.Score as score,
            rd.IsFinishHomework as is_finished_homework,
            rd.Comment as comment,
            DATE_FORMAT(rd.AttendanceDate, '%Y-%m-%d')as date
        FROM class_student cs
        JOIN student s ON s.StudentId = cs.StudentId 
        LEFT JOIN record_attendance rd ON s.StudentId = rd.StudentId AND rd.ClassId = cs.ClassId
        WHERE cs.ClassId = ?
        ORDER BY rd.AttendanceDate DESC;
        `;

        const [attendanceRows]: any[] = await pool.query(attendanceQuery, [classId]);

        const studentsMap = new Map();

        for (const row of attendanceRows) {
            if (!studentsMap.has(row.id)) {
                studentsMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    birthday: row.birthday,
                    total_present: 0,
                    status: row.status,
                    records: []
                });
            }

            const student = studentsMap.get(row.id);

            if (row.present === "Present" || row.present === "Late") {
                student.total_present += 1;
            }

            student.records.push({
                present: row.present,
                score: row.score,
                is_finished_homework: row.is_finished_homework,
                comment: row.comment,
                date: row.date,
                assignments: []
            });
        }

        // FETCH HOMEWORK SUBMISSIONS
        const submissionQuery = `
        SELECT 
            s.StudentId,
            h.Title as title,
            DATE_FORMAT(ch.DueDate, '%Y-%m-%d')as due_date,
            DATE_FORMAT(ch.AssignedDate, '%Y-%m-%d') as assigned_date,
            ch.ClassHomeworkId as id,
            COALESCE(sh.Status, 'Pending') as status,
            DATE_FORMAT(sh.SubmittedDate, '%Y-%m-%d') as submitted_date
        FROM class_student cs
        JOIN student s ON cs.StudentId = s.StudentId
        JOIN class_homework ch ON cs.ClassId = ch.ClassId
        JOIN homework h ON ch.HomeworkId = h.HomeworkId
        LEFT JOIN student_homework sh 
            ON ch.ClassHomeworkId = sh.ClassHomeworkId 
            AND s.StudentId = sh.StudentId
        WHERE cs.ClassId = ?
        ORDER BY s.Name, h.Title;
        `;

        const [assignmentRows]: any[] = await pool.query(submissionQuery, [classId]);

        // GROUP ASSIGNMENTS PER STUDENT
        const assignmentMap = new Map<string, any[]>();

        for (const row of assignmentRows) {
            const assignment = {
                id: row.id,
                title: row.title,
                submitted_date: row.submitted_date,
                status: row.status,
                assigned_date: row.assigned_date,
                due_date: row.due_date,
            };

            if (!assignmentMap.has(row.StudentId)) {
                assignmentMap.set(row.StudentId, []);
            }
            assignmentMap.get(row.StudentId)!.push(assignment);
        }

        // MERGE HOMEWORK INTO ATTENDANCE RECORDS

        for (const [studentId, assignments] of assignmentMap) {
            const student = studentsMap.get(studentId);
            if (!student) continue;

            const records = student.records;

            for (const hw of assignments) {
                const dateRange = generateDateRange(hw.assigned_date, hw.due_date, scheduleObj);

                for (const date of dateRange) {
                    const formattedDate = formatDateForCompare(date);

                    let record = records.find((r: any) => r.date === formattedDate);

                    if (!record) {
                        record = {
                            present: "Unchecked",
                            date: formattedDate,
                            assignments: []
                        };
                        records.push(record);
                    }

                    record.assignments.push(hw);

                }
            }
        }

        return NextResponse.json({
            message: "Success",
            studentAttendanceRecords: Array.from(studentsMap.values())
        });

    } catch (error) {
        console.error("Error with get attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
