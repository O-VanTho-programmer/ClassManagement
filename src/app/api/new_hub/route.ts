import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/curentUser";
import type { PoolConnection } from "mysql2/promise";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const body = await req.json();
        const {
            name,
            description,
            includedTeachers = [],
            owner
        } = body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [newHubRow]: any = await connection.query(
            `INSERT INTO hub (Name, Description)
             VALUES (?, ?)`,
            [name, description]
        );

        const hubId = newHubRow.insertId;

        const queryHubRole = `
            INSERT INTO hub_role (HubId, UserId, Role, IsOwner)
            VALUES (?, ?, ?, ?)
        `;

        await connection.query(queryHubRole, [hubId, owner, "Owner", 1]);

        if (includedTeachers.length > 0) {
            const [teachers]: any = await connection.query(
                `SELECT UserId FROM user WHERE Email IN (?)`,
                [includedTeachers]
            );

            await Promise.all(
                teachers.map((teacher: any) =>
                    connection!.query(queryHubRole, [hubId, teacher.UserId, "Member", 0])
                )
            );
        }

        await connection.commit();
        return NextResponse.json({ message: "Hub created successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error creating hub:", error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Create hub failed" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
