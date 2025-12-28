import pool from "@/lib/db";
import { generateId } from "@/utils/generateId";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId, getHubIdFromHomeworkId } from "@/lib/permissions";

export async function POST(req: Request) {
    let connection;
    try {
        const {
            homework_id,
            class_id,
            assigned_date,
            due_date,
        } = await req.json();
        
        // Get hubId from classId or homeworkId and check permission
        const hubId = await getHubIdFromClassId(class_id) || await getHubIdFromHomeworkId(homework_id);
        if (!hubId) {
            return NextResponse.json({ message: "Class or homework not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.ASSIGN_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        connection = await pool.getConnection();
        connection.beginTransaction();

        const publicIdFrom = generateId(5);

        const queryAssignHomework = `
            INSERT INTO class_homework 
            (ClassId, HomeworkId, DueDate, AssignedDate, PublicIdForm) 
            VALUES (?, ?, ?, ?, ?) 
        `;

        const [classHomework]: any = await connection.query(queryAssignHomework, [class_id, homework_id, due_date, assigned_date, publicIdFrom]);

        const [studentIdsRows]: any[] = await connection.query("SELECT StudentId FROM class_student WHERE ClassId = ?", [class_id]);

        if (studentIdsRows.length > 0) {
            const classHomeworkId = classHomework.insertId;
            const values = studentIdsRows.map((row: any) => [classHomeworkId, row.StudentId]);

            await connection.query("INSERT INTO student_homework (ClassHomeworkId, StudentId) VALUES ?", [values]);
        }

        await connection.commit();

        return NextResponse.json({ message: "Success" }, { status: 200 })
    } catch (error) {
        console.log(error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Error" }, { status: 500 })
    } finally {
        if (connection) {
            connection.release();
        }
    }
}