import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/curentUser";

export async function GET(req: Request) {
    try {
        // Check authentication - only authenticated users can search
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        const queryGetUserListsByEmail = `
            SELECT 
                t.UserId as id,
                t.Name as name,
                t.Email as email,
                t.Phone as phone,
                t.Address as address
            FROM User t
            WHERE t.Email LIKE ?
            GROUP BY t.UserId, t.Name, t.Email, t.Phone, t.Address
            LIMIT 10;
        `;

        const [teacherList] = await pool.query(queryGetUserListsByEmail, ["%"+email+"%"]);

        return NextResponse.json({message:"Success", teacherList }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", error}, {status: 500})
    }
}