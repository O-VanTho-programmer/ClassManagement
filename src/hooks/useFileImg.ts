import { AlertType } from "@/components/AlertProvider/AlertContext";
import { useState } from "react";

export function useFileImg(showAlert: (message: string, type?: AlertType) => void) {
    const [files, setFiles] = useState<File[] | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ? e.target.files : []);

        const valid = selectedFiles.every(file => file.type.startsWith("image/"));

        if (!valid) {
            showAlert("Only image files are allowed!", 'error');
            e.target.value = "";
            return;
        }

        setFiles(selectedFiles);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(previews);
    }

    const handleRemoveFile = (index: number) => {
        if (!files) return;
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
    }

    return { files, previews, handleFileChange, handleRemoveFile };
}