import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const hubId = searchParams.get("hubId");

        if (!hubId) {
            return NextResponse.json({ message: "hub Id is required" }, { status: 400 });
        }

        const queryGetTeacherListByHubId = `
            SELECT 
                t.UserId as id,
                t.Name as name,
                t.Email as email,
                t.Phone as phone,
                t.Address as address
            FROM hub_role hr
            JOIN user t ON hr.UserId = t.UserId
            WHERE hr.HubId = ?
        `;

        const [teacherList] = await pool.query(queryGetTeacherListByHubId, [hubId]);

        return NextResponse.json({ message: "Success", teacherList }, { status: 200 });
    } catch (error) {
        console.log("Error fetching teacher by id", error);
        return NextResponse.json({ message: "Error fetching teacher by id" }, { status: 500 });
    }
}
