import pool from "@/lib/db";
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

        const queryGetStudentAttendance = `
            SELECT 
                s.StudentId AS id,
                s.Name AS name,
                rd.Present as present,
                rd.Score as score,
                rd.IsFinishHomework as is_finished_homework,
                rd.Comment as comment,
                hd.IsHomework as is_homework,
                DATE_FORMAT(rd.CreatedDate, '%m/%d/%Y') as date
            FROM record_attendance rd
            JOIN student s ON s.StudentId = rd.StudentId
            LEFT JOIN homework_date hd ON hd.ClassId = rd.ClassId AND hd.Date = rd.CreatedDate
            WHERE rd.ClassId = ${classId}
            ORDER BY rd.CreatedDate DESC
        `;

        const [studentAttendance] = await pool.query(queryGetStudentAttendance);

        return NextResponse.json({ message: 'Success', studentAttendance }, { status: 200 });
    } catch (error) {
        console.log("Error with get attendance api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}