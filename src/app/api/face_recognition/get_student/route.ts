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

        return NextResponse.json({ message: "Success", studentList }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}