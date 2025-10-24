import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { newStudentForm, hubId } = await req.json();
        const { name, birthday } = newStudentForm;

        const queryNewStudent = `
            INSERT INTO student (Name, DateOfBirth, HubId)
            VALUES (?, ?, ?)
        `;

        const [result] : any = await pool.query(queryNewStudent, [name, birthday, hubId]);
        const newStudentId = result.insertId;

        return NextResponse.json({ message: "Success", newStudentId }, { status: 200 });

    } catch (error) {
        console.log("Error ");
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}