import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            description,
            includedTeachers = [],
            owner
        } = body;

        const [newHubRow]: any = await pool.query(
            `INSERT INTO hub (Name, Description)
             VALUES (?, ?)`,
            [name, description]
        );

        const hubId = newHubRow.insertId;

        const queryHubRole = `
            INSERT INTO hub_role (HubId, UserId, Role)
            VALUES (?, ?, ?)
        `;

        await pool.query(queryHubRole, [hubId, owner, "Master"]);

        if (includedTeachers.length > 0) {
            const [teachers]: any = await pool.query(
                `SELECT UserId FROM user WHERE Email IN (?)`,
                [includedTeachers]
            );

            await Promise.all(
                teachers.map((teacher: any) =>
                    pool.query(queryHubRole, [hubId, teacher.UserId, "Member"])
                )
            );
        }

        return NextResponse.json({ message: "Hub created successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error creating hub:", error);
        return NextResponse.json({ message: "Create hub failed" }, { status: 500 });
    }
}
