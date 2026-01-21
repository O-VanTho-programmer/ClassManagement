import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    //Prevent Unauthorized
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const getMissedStudentSubmissions = `
            SELECT 
                sh.StudentHomeworkId,
                ch.ClassHomeworkId, 
                sh.StudentId,
                s.Name as StudentName,
                u.Email as TeacherEmail,
                h.Title as HomeworkTitle
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN student s ON sh.StudentId = s.StudentId
            JOIN class c ON ch.ClassId = c.ClassId
            JOIN user u ON c.TeacherUserId = u.UserId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE 
                sh.Status = 'Pending'
                AND ch.DueDate < NOW()
        `;

        const [missedStudentSubmissions]: any[] = await connection.query(getMissedStudentSubmissions);

        if(missedStudentSubmissions.length > 0){
            const updateStudentSubmissions = `
                UPDATE student_homework
                JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId 
                SET Status = 'Missed' 
                WHERE Status = 'Pending' 
                AND ch.DueDate < NOW();
            `;

            await connection.query(updateStudentSubmissions);

            console.log("Missed student submissions list:", missedStudentSubmissions);
        }

        await connection.commit();

        return NextResponse.json({"message": "Success"}, {status: 200});
    } catch (error) {
        if(connection){
            connection.rollback();
        }

        console.log(error);
        return NextResponse.json({"message": "Something went wrong"}, {status: 500});
    } finally {
        if(connection){
            connection.release();
        }
    }
}