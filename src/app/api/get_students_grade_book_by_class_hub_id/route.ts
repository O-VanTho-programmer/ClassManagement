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
                    homework_type: student.homework_type
                };
            }
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