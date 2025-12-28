import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function POST(req: Request) {
    try {
        const { studentHomeworkId, grade, feedback } = await req.json();
        
        // Get hubId from studentHomeworkId
        const [studentHomework]: any[] = await pool.query(`
            SELECT h.HubId 
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);
        
        if (studentHomework.length === 0) {
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }
        
        const hubId = studentHomework[0].HubId;
        
        // Check permission - need GRADE_HOMEWORK permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.GRADE_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const querySaveGradeFeedbackSubmission = `
            UPDATE student_homework 
            SET Grade = ?, Feedback = ?, IsGraded = 1
            WHERE StudentHomeworkId = ?
        `;

        const [result] = await pool.query(querySaveGradeFeedbackSubmission, [grade, feedback, studentHomeworkId]);
        
        return NextResponse.json({ message: "Success", result }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 })
    }
}