import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const [includedHubRows]: any = await pool.query(
            `SELECT HubId FROM hub_role WHERE UserId = ?`,
            [userId]
        )

        if (!includedHubRows.length) {
            return NextResponse.json([]);
        }

        let hubIds = includedHubRows.map((row: any) => row.HubId)

        // Create placeholders for the IN clause
        const placeholders = hubIds.map(() => '?').join(',');

        const [hubs] = await pool.query(`
            SELECT 
                h.HubId AS id, 
                h.Name AS name, 
                h.Description AS description,
                COUNT(DISTINCT hr.HubRoleId) AS numberOfTeachers,
                COUNT(DISTINCT c.ClassId) AS numberOfClasses,
                u.Name AS owner
            FROM hub h
            LEFT JOIN hub_role hr ON hr.HubId = h.HubId
            LEFT JOIN class c ON c.HubId = h.HubId
            JOIN user u ON u.UserId = hr.UserId AND hr.IsOwner = 1
            WHERE h.HubId IN (${placeholders})
            GROUP BY h.HubId, h.Name, u.Name
            `, hubIds 
        )

        return NextResponse.json(hubs);
    } catch (error) {
        console.error("Error fetching hubs:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}