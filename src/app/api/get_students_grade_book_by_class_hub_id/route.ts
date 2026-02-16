import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");
        const classId = searchParams.get("classId");
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_STUDENT, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryGetStudentsGradeBookByClassId = `
        
        `;

        return NextResponse.json({ message: "Success" }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 })
    }
}