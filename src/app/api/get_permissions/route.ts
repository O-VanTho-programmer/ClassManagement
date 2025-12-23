import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const queryGetAllPermissions = `
        SELECT PermissionId, Code, Description FROM permissions
        `;

        const [permissions] = await pool.query(queryGetAllPermissions);

        return NextResponse.json({message: "Success", permissions}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
}