import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function POST(req: Request) {
    try {
        const { newStudentForm, hubId } = await req.json();
        
        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_STUDENT, hubId, { hubId });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }
        const { name, birthday } = newStudentForm;

        const queryNewStudent = `
            INSERT INTO student (Name, DateOfBirth, HubId)
            VALUES (?, ?, ?)
        `;

        const [result] : any = await pool.query(queryNewStudent, [name, birthday ? birthday : null, hubId]);
        const newStudentId = result.insertId;

        return NextResponse.json({ message: "Success", newStudentId }, { status: 200 });

    } catch (error) {
        console.log("Error ", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}