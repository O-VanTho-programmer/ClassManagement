import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function POST(req:Request) {
    try {
        const {homeworkId, answerKey} = await req.json();
        
        // Get hubId from homeworkId and check permission
        const hubId = await getHubIdFromHomeworkId(homeworkId);
        if (!hubId) {
            return NextResponse.json({ message: "Homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const querySaveAnswerKeyHomework = `
            UPDATE homework
            SET AnswerKey = ?
            WHERE HomeworkId = ?
        `;

        const [result] = await pool.query(querySaveAnswerKeyHomework, [answerKey, homeworkId]);

        return NextResponse.json({message: "Success", result}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error", error}, {status: 500})
    }
}