import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { dispatchNotification } from "@/lib/notifications";

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

        // 2. Homework Deadline Alerts
        const getHomeworkDeadlines = `
            SELECT 
                ch.ClassHomeworkId,
                ch.ClassId,
                ch.DueDate,
                h.HubId,
                h.Title AS HomeworkTitle,
                c.Name AS ClassName
            FROM class_homework ch
            INNER JOIN homework h ON ch.HomeworkId = h.HomeworkId
            INNER JOIN class c ON ch.ClassId = c.ClassId
            WHERE DATE(ch.DueDate) = DATE(NOW() + INTERVAL 2 DAY) 
               OR DATE(ch.DueDate) = DATE(NOW())
        `;

        const [deadlines]: any[] = await connection.query(getHomeworkDeadlines);

        for (const item of deadlines) {
            const isWarning = new Date(item.DueDate).toDateString() === new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toDateString();
            const type = isWarning ? 'homework_deadline_warning' : 'homework_deadline_passed';
            
            // Check if notification already dispatched today to avoid duplicates
            const [alreadyDispatched]: any[] = await connection.query(
                "SELECT 1 FROM notification WHERE ClassId = ? AND Type = ? AND DATE(CreatedDate) = DATE(NOW()) LIMIT 1",
                [item.ClassId, type]
            );

            if (alreadyDispatched.length === 0) {
                const title = isWarning 
                    ? `Upcoming Deadline Warning: ${item.HomeworkTitle}` 
                    : `Homework Deadline Met: ${item.HomeworkTitle}`;
                const snippet = isWarning 
                    ? `The deadline for ${item.HomeworkTitle} is in 2 days.` 
                    : `The deadline for ${item.HomeworkTitle} is today.`;
                const content = isWarning
                    ? `<p>Dear Teacher,</p>
                       <p>This is a reminder that the homework assignment <b>${item.HomeworkTitle}</b> in class <b>${item.ClassName}</b> is due in <b>2 days</b>.</p>
                       <p>Please encourage students to submit their work before the cutoff date.</p>`
                    : `<p>Dear Teacher,</p>
                       <p>The homework assignment <b>${item.HomeworkTitle}</b> in class <b>${item.ClassName}</b> has reached its due date today.</p>
                       <p>You can now check the grade book to review student submissions and begin evaluations.</p>`;

                await dispatchNotification({
                    hubId: item.HubId,
                    classId: item.ClassId,
                    title,
                    snippet,
                    content,
                    category: 'homework',
                    type,
                    deepLink: `/dashboard/hub/${item.HubId}/grade_book/${item.ClassId}`
                });
            }
        }

        return NextResponse.json({"message": "Success"}, {status: 200});
    } catch (error) {
        if(connection){
            await connection.rollback();
        }

        console.log(error);
        return NextResponse.json({"message": "Something went wrong"}, {status: 500});
    } finally {
        if(connection){
            connection.release();
        }
    }
}