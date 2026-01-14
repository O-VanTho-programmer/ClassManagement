import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const public_id = searchParams.get("public_id");

        const queryCheckFaceAuthEnable = `
            SELECT IsFaceAuthEnabled FROM class_homework
            WHERE PublicIdForm = ?
        `;

        const [result] : any[] = await pool.query(queryCheckFaceAuthEnable, [public_id]);

        return NextResponse.json({ message: "Success", isEnable: result[0].IsFaceAuthEnabled}, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}