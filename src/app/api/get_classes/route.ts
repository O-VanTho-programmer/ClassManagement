import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/curentUser";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Check permission - need VIEW_CLASS to view classes
        const permissionViewAllClassCheck = await checkPermission(req, PERMISSIONS.VIEW_ALL_CLASS, hubId);

        if (permissionViewAllClassCheck instanceof NextResponse) {

            const permissionViewUserClassCheck = await checkPermission(req, PERMISSIONS.VIEW_CLASS, hubId);

            if (permissionViewUserClassCheck instanceof NextResponse) {
                return permissionViewUserClassCheck;
            }
            const queryGetClass = `
            SELECT 
                CL.ClassId as id,
                CL.Name as name,
                CL.Status as status,
                -- Use the student count from our subquery
                COALESCE(StudentCounts.studentCount, 0) as studentCount,
                CL.Subject as subject,
                CL.Tuition as tuition,
                CL.TuitionType as tuitionType,
                CL.Base as base,
                DATE_FORMAT(CL.StartDate, '%m/%d/%Y') as startDate,
                DATE_FORMAT(CL.EndDate, '%m/%d/%Y') as endDate,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'day', SC.DaysOfWeek,
                        'startTime', DATE_FORMAT(SC.StartTime, '%H:%i'),
                        'endTime', DATE_FORMAT(SC.EndTime, '%H:%i')
                    )
                ) AS schedule,
                teacher.Name AS teacher,
                assistant.Name AS assistant
            FROM class as CL 
            JOIN schedule as SC ON CL.ClassId = SC.ClassId
            LEFT JOIN user AS teacher ON CL.TeacherUserId = teacher.UserId
            LEFT JOIN user AS assistant ON CL.AssistantUserId = assistant.UserId
            LEFT JOIN 
                (SELECT ClassId, COUNT(StudentId) as studentCount 
                FROM class_student 
                GROUP BY ClassId) AS StudentCounts ON CL.ClassId = StudentCounts.ClassId
            WHERE 
                CL.HubId = ? AND CL.TeacherUserId = ? OR CL.AssistantUserId = ?
            GROUP BY CL.ClassId, teacher.Name, assistant.Name, StudentCounts.studentCount
            ORDER BY CL.ClassId;
    `
            const [classData] = await pool.query(queryGetClass, [hubId, user.userId, user.userId]);
            return NextResponse.json({ message: "Success", classData }, { status: 200 })

        }
        else {
            const queryGetClass = `
                SELECT 
                    CL.ClassId as id,
                    CL.Name as name,
                    CL.Status as status,
                    -- Use the student count from our subquery
                    COALESCE(StudentCounts.studentCount, 0) as studentCount,
                    CL.Subject as subject,
                    CL.Tuition as tuition,
                    CL.TuitionType as tuitionType,
                    CL.Base as base,
                    DATE_FORMAT(CL.StartDate, '%m/%d/%Y') as startDate,
                    DATE_FORMAT(CL.EndDate, '%m/%d/%Y') as endDate,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'day', SC.DaysOfWeek,
                            'startTime', DATE_FORMAT(SC.StartTime, '%H:%i'),
                            'endTime', DATE_FORMAT(SC.EndTime, '%H:%i')
                        )
                    ) AS schedule,
                    teacher.Name AS teacher,
                    assistant.Name AS assistant
                FROM class as CL 
                JOIN schedule as SC ON CL.ClassId = SC.ClassId
                LEFT JOIN user AS teacher ON CL.TeacherUserId = teacher.UserId
                LEFT JOIN user AS assistant ON CL.AssistantUserId = assistant.UserId
                LEFT JOIN 
                    (SELECT ClassId, COUNT(StudentId) as studentCount 
                    FROM class_student 
                    GROUP BY ClassId) AS StudentCounts ON CL.ClassId = StudentCounts.ClassId
                WHERE 
                    CL.HubId = ?
                GROUP BY CL.ClassId, teacher.Name, assistant.Name, StudentCounts.studentCount
                ORDER BY CL.ClassId;
        `
            const [classData] = await pool.query(queryGetClass, [hubId]);
            return NextResponse.json({ message: "Success", classData }, { status: 200 })
        }
    } catch (error) {
        console.log("Error fetching classes", error);
        return NextResponse.json({ message: "Error fetching classes" }, { status: 500 })
    }


}