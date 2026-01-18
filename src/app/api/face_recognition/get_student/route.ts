import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const class_homework_id = searchParams.get("class_homework_id");

        const queryGetStudentWithFaceDescriptor = `
            SELECT 
                s.StudentId AS id,
                s.Name AS name,
                DATE_FORMAT(s.DateOfBirth, '%m/%d/%Y') as birthday,
                s.Status as status,
                s.FaceImageUrl as face_img_url,
                s.FaceDescriptor as face_descriptor
            FROM student_homework sh
            JOIN student s ON sh.StudentId = s.StudentId
            WHERE sh.ClassHomeworkId = ?
        `;

        const [studentList]: any[] = await pool.query(queryGetStudentWithFaceDescriptor, [class_homework_id]);

        // Parse JSON face_descriptor if it exists (handle both string and already-parsed JSON)
        const parsedStudentList = studentList.map((student: any) => {
            if (student.face_descriptor) {
                if (typeof student.face_descriptor === 'string') {
                    try {
                        student.face_descriptor = JSON.parse(student.face_descriptor);
                    } catch (e) {
                        console.error('Error parsing face_descriptor JSON:', e);
                        student.face_descriptor = null;
                    }
                }
            }
            return student;
        });

        return NextResponse.json({ message: "Success", studentList: parsedStudentList }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}