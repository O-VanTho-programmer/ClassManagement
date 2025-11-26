import cloudinary from "@/lib/cloudinary/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ message: "No files uploaded" }, { status: 400 });
        }
        
        const uploadedUrls: ResultUpload[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());

            const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "homework_submissions",
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as UploadApiResponse);
                    }
                ).end(buffer);
            });

            uploadedUrls.push({
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            });
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });

    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}