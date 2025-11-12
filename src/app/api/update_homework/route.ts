import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req:Request) {
    try {
        const {title, content, homeworkId} = await req.json();

        const queryUpdateHomework = `
            UPDATE homework
            SET Title = ?, Content = ?, UpdatedDate = NOW()
            WHERE HomeworkId = ?
        `;

        const [result] = await pool.query(queryUpdateHomework, [title, content, homeworkId]);
        
        return NextResponse.json({ message: "Homework data updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("Error updating homework:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    
    }
}