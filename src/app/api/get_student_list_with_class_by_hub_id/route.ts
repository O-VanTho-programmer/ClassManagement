import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hubId = searchParams.get("hubId");
        const offset = parseInt(searchParams.get("offset") || "0");
        const limit = parseInt(searchParams.get("limit") || "1000");
        const search = searchParams.get("search");
        const status = searchParams.get("status");
        const classId = searchParams.get("classId");

        if (!hubId) {
            return NextResponse.json({ message: "Hub id is required" }, { status: 400 });
        }

        // Check permission
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_STUDENT, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        let queryGetStudentListByHubId = `
            SELECT DISTINCT
                s.StudentId AS id,
                s.Name AS name,
                DATE_FORMAT(s.DateOfBirth, '%m/%d/%Y') as birthday,
                s.Status as status,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'class_id', c.ClassId,
                        'class_name', c.Name,
                        'enroll_date', DATE_FORMAT(cs.EnrollDate, '%m/%d/%Y')
                    )
                ) AS classes
            FROM student s
            LEFT JOIN class_student cs ON s.StudentId = cs.StudentId
            LEFT JOIN class c ON cs.ClassId = c.ClassId
            WHERE s.HubId = ?
            
        `;

        const queryParams: any[] = [hubId];

        if (search) {
            queryGetStudentListByHubId += `
                AND s.Name LIKE ?
            `;

            queryParams.push(`%${search}%`);
        }

        if (status !== "All" && status) {
            queryGetStudentListByHubId += `
                AND s.Status = ?
            `;

            queryParams.push(status);
        }

        if (classId !== "All" && classId) {
            queryGetStudentListByHubId += `
                AND cs.ClassId = ?
            `;

            queryParams.push(classId);
        }

        queryGetStudentListByHubId += `
            GROUP BY s.StudentId
            LIMIT ?, ?;
        `
        queryParams.push(offset, limit);

        const [studentList] = await pool.query(queryGetStudentListByHubId, queryParams);

        return NextResponse.json({ message: "Success", studentList }, { status: 200 });
    } catch (error) {
        console.log("Error fetching student list by hub id", error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}