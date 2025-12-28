import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get("classId");
        
        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId || "");
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryGetDateHasHomework = `
            SELECT 
                DATE_FORMAT(AssignedDate, '%m/%d/%Y') as date 
            FROM class_homework
            WHERE ClassId = ?
        `;

        const [dateHasHomework] = await pool.query(queryGetDateHasHomework, [classId]);

        return NextResponse.json({message: "Success", dateHasHomework}, {status: 200});
    } catch (error) {
        console.log("Error get date has homework", error);
        return NextResponse.json({message: "Internal server error", error}, {status: 500})
    }

}