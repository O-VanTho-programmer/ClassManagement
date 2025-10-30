import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");

        const queryGetTeacherWorkloads = `
            SELECT 
                t.UserId AS id,
                t.Name AS name,
                t.Email AS email,
                t.Phone AS phone,
                t.Address AS address,
                hr.Role AS role_hub,
                COUNT(DISTINCT c.ClassId) AS classCount,
                COUNT(DISTINCT cs.StudentId) AS studentCount
            FROM hub_role hr
            JOIN user t ON t.UserId = hr.UserId
            LEFT JOIN class c ON c.TeacherUserId = t.UserId AND c.HubId = hr.HubId
            LEFT JOIN class_student cs ON cs.ClassId = c.ClassId
            WHERE hr.HubId = ?
            GROUP BY 
                t.UserId,
                t.Name,
                t.Email,
                t.Phone,
                t.Address,
                hr.Role;
        `;

        const [teachWorkloads] = await pool.query(queryGetTeacherWorkloads, [hubId]);

        return NextResponse.json({message:"Success", teachWorkloads }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", error}, {status: 500})
    }
}