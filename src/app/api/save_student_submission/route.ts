import { deleteCloudImage } from "@/lib/cloudinary/deleteCloudImage";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";


export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId, dueDate, submissionDataUrls } = await req.json();
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Get hubId from studentHomeworkId
        const [studentHomework]: any[] = await connection.query(`
            SELECT h.HubId, sh.UploadSubmission
            FROM student_homework sh
            JOIN class_homework ch ON sh.ClassHomeworkId = ch.ClassHomeworkId
            JOIN homework h ON ch.HomeworkId = h.HomeworkId
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);
        
        if (studentHomework.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }
        
        const hubId = studentHomework[0].HubId;
        const existingSubmission = studentHomework[0].UploadSubmission;
        
        // Check permission - students can submit their own homework, but we still check VIEW_HOMEWORK
        // In a real system, you might want to check if the user is the student themselves
        const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HOMEWORK, hubId);
        if (permissionCheck instanceof NextResponse) {
            await connection.rollback();
            return permissionCheck;
        }

        const dueDateHomework = new Date(dueDate);
        const currentDate = new Date();
        
        let statusSubmission = 'Submitted'; 

        if (dueDateHomework < currentDate) {
            statusSubmission = 'Overdue';
        }

        // Delete old images if they exist (before updating the database)
        if (existingSubmission) {
            try {
                const oldImagesUrl = JSON.parse(existingSubmission);

                if (Array.isArray(oldImagesUrl)) {
                    // Delete old images from Cloudinary (non-transactional, but we handle errors)
                    await Promise.all(oldImagesUrl.map(async (item: any) => {
                        const publicId = item.public_id;
                        if (publicId) {
                            try {
                                await deleteCloudImage(publicId);
                            } catch (deleteError) {
                                console.error("Error deleting old image from Cloudinary:", deleteError);
                                // Continue even if deletion fails
                            }
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

        await connection.query(querySaveStudentSubmission, [jsonUrlsList, statusSubmission, studentHomeworkId]);

        await connection.commit();

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error: any) {
        console.error("Save Submission Error:", error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}