import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hub_id");
        const classId = searchParams.get("class_id");

        if (!hubId || !classId) {
            return NextResponse.json({ message: "Missing hub_id or class_id" }, { status: 400 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_STUDENT, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryAssignments = `
            SELECT 
                ch.ClassHomeworkId as class_homework_id,
                h.Title as title,
                ch.Type as homework_type
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.ClassId = ?
            ORDER BY ch.Type, ch.DueDate ASC
        `;

        const queryGetStudentsGradeBookByClassId = `
            SELECT 
                ch.ClassHomeworkId as class_homework_id,
                s.StudentId AS id,
                s.Name AS name,
                sh.Grade as grade,
                sh.Feedback as feedback,
                sh.UploadSubmission as submission_urls,
                sh.Status as homework_status,
                sh.NeedsReview as needs_review,
                sh.TimingStatus as timing_status,
                ch.Type as homework_type
            FROM class_student cs
            JOIN student s ON s.StudentId = cs.StudentId
            LEFT JOIN class_homework ch ON ch.ClassId = cs.ClassId
            LEFT JOIN student_homework sh ON sh.ClassHomeworkId = ch.ClassHomeworkId AND sh.StudentId = s.StudentId
            WHERE cs.ClassId = ?
            ORDER BY s.Name ASC
        `;
        const [assignments]: any[] = await pool.query(queryAssignments, [classId]);
        const [studentGrades]: any[] = await pool.query(queryGetStudentsGradeBookByClassId, [classId]);

        // Fetch attendance records for all students in this class
        const queryAttendance = `
            SELECT 
                StudentId AS student_id,
                Present AS present
            FROM record_attendance
            WHERE ClassId = ?
        `;
        const [attendanceRecords]: any[] = await pool.query(queryAttendance, [classId]);

        // Map student_id to their attendance records
        const attendanceMap = new Map<number, string[]>();
        attendanceRecords.forEach((rec: any) => {
            if (!attendanceMap.has(rec.student_id)) {
                attendanceMap.set(rec.student_id, []);
            }
            if (rec.present) {
                attendanceMap.get(rec.student_id)!.push(rec.present);
            }
        });

        // Determine grading scale (10-point vs 100-point) based on homework grades
        let maxGradeSeen = 0;
        let hasGrades = false;
        studentGrades.forEach((student: any) => {
            if (student.grade !== null) {
                hasGrades = true;
                if (student.grade > maxGradeSeen) {
                    maxGradeSeen = student.grade;
                }
            }
        });
        const isTenPointScale = hasGrades && maxGradeSeen <= 10;
        const maxAttendanceGrade = isTenPointScale ? 10 : 100;

        const columnsType: Record<string, any[]> = {};
        assignments.forEach((assignment: any) => {
            const type = assignment.homework_type || 'Uncategorized';
            if (!columnsType[type]) {
                columnsType[type] = [];
            }
            columnsType[type].push({
                class_homework_id: assignment.class_homework_id,
                title: assignment.title
            });
        });

        // Add Attendance category and rate column to columnsType
        columnsType["Attendance"] = [
            {
                class_homework_id: "attendance",
                title: "Attendance Rate"
            }
        ];

        let studentMap = new Map<number, any>();

        studentGrades.forEach((student: any) => {
            if (!studentMap.has(student.id)) {
                studentMap.set(student.id, {
                    id: student.id,
                    name: student.name,
                    assignments: {},
                    averages: {}, // average of assignments with a specific Type
                    total_grade: 0
                });
            }

            if (student.class_homework_id) {
                studentMap.get(student.id).assignments[student.class_homework_id] = {
                    grade: student.grade,
                    feedback: student.feedback,
                    submission_urls: student.submission_urls,
                    homework_status: student.homework_status,
                    needs_review: !!student.needs_review,
                    timing_status: student.timing_status,
                    homework_type: student.homework_type
                };
            }
        });

        // Inject attendance grades into each student's assignments
        studentMap.forEach((value, key) => {
            const studentAttendanceList = attendanceMap.get(key) || [];
            const totalSessions = studentAttendanceList.length;
            const presentCount = studentAttendanceList.filter(p => p === 'Present' || p === 'Late' || p === 'Excused').length;
            
            const attendanceScore = totalSessions > 0 
                ? parseFloat(((presentCount / totalSessions) * maxAttendanceGrade).toFixed(2)) 
                : maxAttendanceGrade;

            value.assignments["attendance"] = {
                grade: attendanceScore,
                feedback: `${presentCount}/${totalSessions} sessions attended`,
                submission_urls: null,
                homework_status: 'Finished',
                needs_review: false,
                timing_status: 'OnTime',
                homework_type: 'Attendance'
            };
        });

        const rowsStudents = Array.from(studentMap.values()).map(stu => {
            let total = 0;
            let countForFinalGrade = 0;

            Object.keys(columnsType).forEach(type => {
                const assignmentsOfType = columnsType[type];
                let sum = 0;
                let count = 0;

                assignmentsOfType.forEach(assignment => {
                    const studentAssignment = stu.assignments[assignment.class_homework_id];
                    
                    if (studentAssignment && studentAssignment.grade !== null) {
                        sum += Number(studentAssignment.grade);
                        count++;
                    }
                });

                stu.averages[type] = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
                total += stu.averages[type];
                countForFinalGrade++;
            });

            stu.final_grade = countForFinalGrade > 0 
                ? parseFloat((total / countForFinalGrade).toFixed(2)) 
                : 0;
                
            return stu;
        });

        console.log(rowsStudents);

        return NextResponse.json({
            message: "Success",
            columns: columnsType,
            data: rowsStudents
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}