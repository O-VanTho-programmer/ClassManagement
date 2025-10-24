import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");

        const queryGetStudentListByHubId = `
            SELECT DISTINCT
                s.StudentId AS id,
                s.Name AS name,
                DATE_FORMAT(s.DateOfBirth, '%m/%d/%Y') as birthday,
                s.Status as status
            FROM student s
            WHERE s.HubId=?
        `;

        const [studentList]= await pool.query(queryGetStudentListByHubId, [hubId]);
        
        return NextResponse.json({message: "Success", studentList}, {status: 200});
    } catch (error) {
        console.log("Error fetching student list by hub id", error);
        return NextResponse.json({message: "Error"}, {status: 500});
    }
}