import cloudinary from "./cloudinary";

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