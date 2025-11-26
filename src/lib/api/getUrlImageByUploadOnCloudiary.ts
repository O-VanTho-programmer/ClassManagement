import api from "../axios";

export async function getUrlImageByUploadOnCloudiary(files:File[]) {
    try {
        const formData = new FormData();

        files.forEach(file => {
            formData.append("files", file);
        });
        
        const res = await api.post("upload_to_cloudinary", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data.urls;
    } catch (error) {
        console.error("Error uploading files:", error);
        return null;
    }
}