import { deleteCloudImage } from "@/lib/cloudinary/deleteCloudImage";
import cloudinary from "@/lib/cloudinary/cloudinary";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/curentUser";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { image, descriptor, student_id } = await req.json();

        if (!student_id || !image || !descriptor) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const [studentRows]: any[] = await pool.query(
            `SELECT FaceImagePublicId FROM student WHERE StudentId = ?`,
            [student_id]
        );

        if (studentRows.length === 0) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        const oldFaceImagePublicId = studentRows[0].FaceImagePublicId;

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "face_registry",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            ).end(buffer);
        });

        const faceImageUrl = uploadResult.secure_url;
        const faceImagePublicId = uploadResult.public_id;

        await pool.query(
            `UPDATE student SET FaceDescriptor = ?, FaceImageUrl = ?, FaceImagePublicId = ? WHERE StudentId = ?`,
            [descriptor, faceImageUrl, faceImagePublicId, student_id]
        );

        if (oldFaceImagePublicId) {
            try {
                deleteCloudImage(oldFaceImagePublicId);
            } catch (deleteError) {
                console.error("Error deleting old face image with public ID: " + oldFaceImagePublicId, deleteError);
            }
        }

        return NextResponse.json({ 
            message: "Face registered successfully",
            faceImageUrl: faceImageUrl
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error registering face:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
