import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function DELETE(req:Request) {
    try {
        const {studentId, classId} = await req.json();
        
        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.REMOVE_STUDENT_CLASS, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        if (!studentId || !classId) {
            throw new Error("Missing studentId or classId");
        }

        const queryRemoveStudentFromClass = `
            DELETE FROM class_student
            WHERE ClassId = ? AND StudentId = ?
        `;

        const [row] = await pool.query(queryRemoveStudentFromClass, [classId, studentId]);

        return NextResponse.json({message: "Success", row}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500})
    }
}