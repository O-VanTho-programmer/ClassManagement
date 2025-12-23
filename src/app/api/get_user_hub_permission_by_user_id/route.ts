import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, hubId } = body;

        if (!userId || !hubId) {
            return NextResponse.json({ permissions: [] }, { status: 400 });
        }

        const [isOwner]: any[] = await pool.query(`
            SELECT 1 FROM hub_role
            WHERE UserId = ? AND HubId = ? AND (Role = 'Master' OR IsOwner = 1)
            LIMIT 1
          `, [userId, hubId]);

        if (isOwner.length > 0) {
            return ["Owner"];
        }

        const queryGetAllUserHubPermission = `
            SELECT 
              p.PermissionId,
              p.Code,
              p.Description
            FROM hub_role hr
            JOIN hub_permissions hp ON hr.HubId = hp.HubId
            JOIN permissions p ON hp.PermissionId = p.PermissionId
            WHERE hr.UserId = ? AND hr.HubId = ?
          `;

        const [permissions]: any[] = await pool.query(queryGetAllUserHubPermission, [userId, hubId]);

        const permissionCodes = permissions.map((p: any) => p.Code);

        return NextResponse.json({ permissions: permissionCodes }, { status: 200 });

    } catch (error) {
        console.error('Error in permission API:', error);
        return NextResponse.json({ permissions: [] }, { status: 500 });
    }
}