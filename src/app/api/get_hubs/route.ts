import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const queryGetHubsByUserId = `
            SELECT 
                h.HubId AS id,
                h.Name AS name,
                h.Description AS description,
                u.Name AS owner,
                COUNT(DISTINCT hr2.UserId) AS numberOfTeachers,
                COUNT(DISTINCT c.ClassId) AS numberOfClasses,
                hr.Role AS userRole,
                hr.IsOwner AS isOwner
            FROM hub h
            JOIN hub_role hr ON hr.HubId = h.HubId
            LEFT JOIN hub_role hr_owner ON hr_owner.HubId = h.HubId AND hr_owner.IsOwner = 1
            LEFT JOIN user u ON u.UserId = hr_owner.UserId
            LEFT JOIN class c ON c.HubId = h.HubId
            LEFT JOIN hub_role hr2 ON hr2.HubId = h.HubId
            WHERE hr.UserId = ?
            GROUP BY h.HubId, u.UserId, hr.Role, hr.IsOwner;

        `;

        const [hubs]: any = await pool.query(queryGetHubsByUserId, [userId]);
        
        return NextResponse.json({messages: "Success", hubs}, { status: 200 });
    } catch (error) {
        console.error("Error fetching hubs:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}