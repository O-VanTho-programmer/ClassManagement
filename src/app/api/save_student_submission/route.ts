import { deleteCloudImage } from "@/lib/cloudinary/deleteCloudImage";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { studentHomeworkId, dueDate, submissionDataUrls } = await req.json();

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