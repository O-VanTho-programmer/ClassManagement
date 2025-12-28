import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function POST(req:Request) {
    try {
        const {studentId, classId, enrollDate} = await req.json();
        
        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.ADD_STUDENT_CLASS, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryAddStudentIntoClass = `
            INSERT INTO class_student (ClassId, StudentId, EnrollDate)
            VALUES (?, ?, ?)
        `;

        await pool.query(queryAddStudentIntoClass, [classId, studentId, enrollDate]);

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.log("Error with new attendance record api", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}