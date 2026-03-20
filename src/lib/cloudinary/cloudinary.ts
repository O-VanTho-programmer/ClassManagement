import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export async function deleteCloudImage(publicId: string) {
    try {
        const res = cloudinary.uploader.destroy(publicId);
        console.log("Delete Image +", publicId);
        return res;
    } catch (error) {
        console.error("Failed to delete Cloudinary file:", publicId, error);
        return null;
    }
}