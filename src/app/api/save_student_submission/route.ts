import { deleteCloudImage } from "@/lib/cloudinary/deleteCloudImage";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";


export async function POST(req: Request) {
    try {
        const { studentHomeworkId, dueDate, submissionDataUrls } = await req.json();
        
        // Get hubId from studentHomeworkId
        const [studentHomework]: any[] = await pool.query(`
            SELECT h.HubId 
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);
        
        if (studentHomework.length === 0) {
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }
        
        const hubId = studentHomework[0].HubId;
        
        // Check permission - students can submit their own homework, but we still check VIEW_HOMEWORK
        // In a real system, you might want to check if the user is the student themselves
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const dueDateHomework = new Date(dueDate);
        const currentDate = new Date();
        
        let statusSubmission = 'Submitted'; 

        if (dueDateHomework < currentDate) {
            statusSubmission = 'Overdue';
        }

        const queryExistedSubmission = `
            SELECT UploadSubmission
            FROM student_homework
            WHERE StudentHomeworkId = ?
        `;

        const [existedSubmission]: any = await pool.query(queryExistedSubmission, [studentHomeworkId]);

        if (existedSubmission.length > 0 && existedSubmission[0].UploadSubmission) {
            try {
                const oldImagesUrl = JSON.parse(existedSubmission[0].UploadSubmission);

                if (Array.isArray(oldImagesUrl)) {
                    await Promise.all(oldImagesUrl.map(async (item: any) => {
                        const publicId = item.public_id;
                        if (publicId) {
                            await deleteCloudImage(publicId);
                        }
                    }));
                }
            } catch (parseError) {
                console.error("Error parsing old submission JSON:", parseError);
            }
        }

        const jsonUrlsList = JSON.stringify(submissionDataUrls);

        const querySaveStudentSubmission = `
            UPDATE student_homework 
            SET 
                UploadSubmission = ?,
                Status = ?,
                SubmittedDate = NOW()
            WHERE StudentHomeworkId = ?
        `;

        const [result] = await pool.query(querySaveStudentSubmission, [jsonUrlsList, statusSubmission, studentHomeworkId]);

        return NextResponse.json({ message: "Success", result }, { status: 200 });

    } catch (error: any) {
        console.error("Save Submission Error:", error);
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}