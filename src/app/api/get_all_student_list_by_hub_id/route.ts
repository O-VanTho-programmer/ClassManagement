import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");

        const queryGetStudentListByHubId = `
            SELECT 
                s.StudentId AS id,
                s.Name AS name,
                DATE_FORMAT(s.DateOfBirth, '%m/%d/%Y') as birthday,
                s.EnrollDate as enroll_date,
                s.Status as status
            FROM class c
            JOIN class_student cs ON c.ClassId = cs.ClassId
			JOIN student s ON s.StudentId = cs.StudentId
            WHERE c.HubId=?
        `;

        const [studentList]= await pool.query(queryGetStudentListByHubId, [hubId]);
        
        return NextResponse.json({message: "Success", studentList}, {status: 200});
    } catch (error) {
        console.log("Error fetching student list by hub id", error);
        return NextResponse.json({message: "Error"}, {status: 500});
    }
}