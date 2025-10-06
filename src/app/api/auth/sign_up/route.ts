import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existedEmailQuery = `
            SELECT UserId FROM user
            WHERE Email = ?
        `;

        const [existedEmail] = await pool.query(existedEmailQuery, [email]) as any[];

        if (existedEmail.length > 0) {
            return NextResponse.json({ message: "Email has been used" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserQuery = `
            INSERT INTO user (Name, Email, HashedPassword, Role, IsAdmin)
            VALUES (?, ?, ?, ?, ?)
        `;

        await pool.query(newUserQuery, [username, email, hashedPassword, "Teacher", false]);

        return NextResponse.json({ 
            message: "User created successfully",
        }, { status: 201 });
        
    } catch (error) {
        console.error('Sign-up error:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}