import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const classId = searchParams.get("classId");
        
        // Get hubId from classId and check permission
        const hubId = await getHubIdFromClassId(classId || "");
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_CLASS, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryGetClassById = `
        SELECT 
            CL.ClassId as id,
            CL.Name as name,
            CL.Status as status,
            COALESCE(StudentCounts.studentCount, 0) as studentCount,
            CL.Subject as subject,
            CL.Tuition as tuition,
            CL.TuitionType as tuitionType,
            CL.Base as base,
            DATE_FORMAT(CL.StartDate,'%m/%d/%Y') as startDate,
            DATE_FORMAT(CL.EndDate,'%m/%d/%Y') as endDate,
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
        WHERE CL.ClassId= ?
        GROUP BY CL.ClassId
        `

        const [rows]: any[] = await pool.query(queryGetClassById, [classId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }
        
        const classData = rows[0];

        return NextResponse.json({message: "Success", classData}, {status: 200})
    } catch (error) {
        console.log("Error fetching class by id", error);
        return NextResponse.json({message: "Error fetching class by id"}, {status: 500})
    }
}