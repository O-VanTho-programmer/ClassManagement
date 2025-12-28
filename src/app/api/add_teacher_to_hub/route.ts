import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function POST(req:Request) {
    try {
        const {teacherId, hubId} = await req.json();
        
        // Check permission - need EDIT_MEMBER to add teachers
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_MEMBER, hubId, { hubId });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryAddTeacherToHub = `
            INSERT INTO hub_role (UserId, HubId, Role, IsOwner)
            VALUES (?, ?, 'Member', 0);  
        `

        await pool.query(queryAddTeacherToHub, [teacherId, hubId]);

        return NextResponse.json({message: "Success"}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", error}, {status: 500})
    }
}