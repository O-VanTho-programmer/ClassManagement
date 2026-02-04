import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/curentUser";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Check permission - need VIEW_CLASS to view classes
        const permissionViewAllClassCheck = await checkPermission(req, PERMISSIONS.VIEW_ALL_CLASS, hubId);

        if (permissionViewAllClassCheck instanceof NextResponse) {

            const permissionViewUserClassCheck = await checkPermission(req, PERMISSIONS.VIEW_CLASS, hubId);

            if (permissionViewUserClassCheck instanceof NextResponse) {
                return permissionViewUserClassCheck;
            }
            const queryGetClass = `
            SELECT 
                CL.ClassId as id,
                CL.Name as name,
                CL.Status as status,
            FROM class as CL 
            JOIN hub_role hr ON CL.HubId = hr.HubId AND hr.UserId = ?
            WHERE 
                CL.HubId = ? AND (CL.TeacherUserId = ? OR CL.AssistantUserId = ? OR hr.IsOwner = 1)
            GROUP BY CL.ClassId
            ORDER BY CL.ClassId;
    `
            const [classData] = await pool.query(queryGetClass, [user.userId ,hubId, user.userId, user.userId]);
            return NextResponse.json({ message: "Success", classData }, { status: 200 })

        }
        else {
            const queryGetClass = `
                SELECT 
                    ClassId as id,
                    Name as name,
                    Status as status
                FROM class 
                WHERE HubId = ?;
        `
            const [classData] = await pool.query(queryGetClass, [hubId]);
            return NextResponse.json({ message: "Success", classData }, { status: 200 })
        }
    } catch (error) {
        console.log("Error fetching classes", error);
        return NextResponse.json({ message: "Error fetching classes" }, { status: 500 })
    }


}