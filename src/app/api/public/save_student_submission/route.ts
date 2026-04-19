import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { PoolConnection } from "mysql2/promise";
import { deleteCloudImage } from "@/lib/cloudinary/cloudinary";

export async function POST(req: Request) {
    let connection: PoolConnection | undefined;
    try {
        const { studentHomeworkId, dueDate, submissionDataUrls, securityStatus } = await req.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get existing submission from studentHomeworkId
        const [studentHomework]: any[] = await connection.query(`
            SELECT sh.UploadSubmission
            FROM student_homework sh
            WHERE sh.StudentHomeworkId = ?
        `, [studentHomeworkId]);

        if (studentHomework.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Student homework not found" }, { status: 404 });
        }

        const existingSubmission = studentHomework[0].UploadSubmission;

        const dueDateHomework = new Date(dueDate);
        const currentDate = new Date();

        let statusSubmission = 'Submitted';

        if (dueDateHomework < currentDate) {
            statusSubmission = 'Overdue';
        }

        if (existingSubmission) {
            try {
                const oldImagesUrl = JSON.parse(existingSubmission);

                if (Array.isArray(oldImagesUrl)) {
                    await Promise.all(oldImagesUrl.map(async (item: any) => {
                        const publicId = item.public_id;
                        if (publicId) {
                            try {
                                await deleteCloudImage(publicId);
                            } catch (deleteError) {
                                console.error("Error deleting old image from Cloudinary:", deleteError);
                            }
                        }
                    }));
                }
            } catch (parseError) {
                console.error("Error parsing old submission JSON:", parseError);
            }
        }

        const jsonUrlsList = JSON.stringify(submissionDataUrls);
        // securityStatus can be: 'Verified' | 'Unverified' | 'None'
        const resolvedSecurityStatus = securityStatus || 'None';

        const querySaveStudentSubmission = `
            UPDATE student_homework 
            SET 
                UploadSubmission = ?,
                Status = ?,
                SecurityStatus = ?,
                SubmittedDate = NOW()
            WHERE StudentHomeworkId = ?
        `;

        await connection.query(querySaveStudentSubmission, [jsonUrlsList, statusSubmission, resolvedSecurityStatus, studentHomeworkId]);

        await connection.commit();

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error: any) {
        console.error("Save Submission Public Error:", error);
        if (connection) await connection.rollback();
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
