import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");

        const queryGetStudentListByClassId = `
            SELECT 
                s.StudentId AS id,
                s.Name AS name,
                DATE_FORMAT(s.DateOfBirth, '%m/%d/%Y') as birthday,
                DATE_FORMAT(cs.EnrollDate, '%m/%d/%Y') as enroll_date,
                s.Status as status
            FROM student s
            JOIN class_student cs ON s.StudentId = cs.StudentId
            WHERE cs.ClassId = ?
        `;

        const [studentList] = await pool.query(queryGetStudentListByClassId, [classId]);

        return NextResponse.json({message: "Success", studentList}, {status: 200});
    } catch (error) {
        console.log("Error fetching student list by class id", error);
        return NextResponse.json({message: "Error"}, {status: 500});
    }
}