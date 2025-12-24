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
                hr.IsOwner AS is_owner,
                COUNT(DISTINCT c.ClassId) AS classCount,
                COUNT(DISTINCT cs.StudentId) AS studentCount,
                JSON_ARRAYAGG(p.Code) as permissions
            FROM hub_role hr
            JOIN user t ON t.UserId = hr.UserId
            LEFT JOIN class c ON c.TeacherUserId = t.UserId AND c.HubId = hr.HubId
            LEFT JOIN class_student cs ON cs.ClassId = c.ClassId
            LEFT JOIN hub_permissions hp ON hr.HubRoleId = hp.HubRoleId
            LEFT JOIN permissions p ON hp.PermissionId = p.PermissionId
            WHERE hr.HubId = ?
            GROUP BY 
                t.UserId,
                t.Name,
                t.Email,
                t.Phone,
                t.Address,
                hr.IsOwner,
                hr.Role;
        `;

        const [teachWorkloadsRows]: any[] = await pool.query(queryGetTeacherWorkloads, [hubId]);

        if (teachWorkloadsRows.length === 0) {
            return NextResponse.json({ message: "No teacher found" }, { status: 404 });
        }

        const teachWorkloads = teachWorkloadsRows.map((row: any) => {
            let permissions = [];

            if (row.is_owner || row.role_hub === "Owner" || row.role_hub === "Master") {
                permissions = ["*"];
            } else {
                if (Array.isArray(row.permissions)) {
                    permissions = row.permissions.filter((p: any) => p !== null);
                } else if (typeof row.permissions === 'string') {
                    try {
                        const parsed = JSON.parse(row.permissions);
                        if (Array.isArray(parsed)) {
                            permissions = parsed.filter((p: any) => p !== null);
                        }
                    } catch (e) {
                        permissions = [];
                    }
                }
            }

            return {
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                address: row.address,
                role_hub: row.role_hub,
                is_owner: row.is_owner,
                classCount: row.classCount,
                studentCount: row.studentCount,
                permissions: permissions
            }
        })

        return NextResponse.json({ message: "Success", teachWorkloads }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 })
    }
}