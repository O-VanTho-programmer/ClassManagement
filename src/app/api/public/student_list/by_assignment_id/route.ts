import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const public_id = searchParams.get("public_id");
        
        const [assignment]: any[] = await pool.query(`
            SELECT h.HubId, ch.ClassHomeworkId
            FROM class_homework ch
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE ch.PublicIdForm = ?
        `, [public_id]);
        
        if (assignment.length === 0) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        const assignment_id = assignment[0].ClassHomeworkId;
        
        const queryGetStudentByAssignmentId = `
            SELECT  
                s.StudentId AS id,
                s.Name AS name,
                s.DateOfBirth AS birthday,
                s.Status AS status,
                sh.StudentHomeworkId AS student_homework_id,
                sh.Status AS homework_status,
				sh.UploadSubmission AS submission_urls,
                sh.SubmittedDate AS submitted_date,
                sh.IsGraded AS is_graded,
                sh.Grade AS grade,
                sh.Feedback AS feedback,
                s.FaceDescriptor AS face_descriptor
            FROM student_homework sh
            JOIN student s ON sh.StudentId = s.StudentId
            WHERE sh.ClassHomeworkId = ?
        `;

        const [row]: any[] = await pool.query(queryGetStudentByAssignmentId, [assignment_id]);
        const studentList = row.map((item: any) => ({
            ...item,
            submission_urls: item.submission_urls ? JSON.parse(item.submission_urls) : []
        }));
        
        return NextResponse.json({ message: "Success", studentList }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}