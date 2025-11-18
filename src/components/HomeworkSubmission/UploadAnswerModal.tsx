import { FileImage, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import SquareButton from '../SquareButton/SquareButton'
import IconButton from '../IconButton/IconButton'
import Button from '../Button/Button'

type UploadAnswerModalProps = {
    isOpen: boolean
    onClose: () => void
    studentName: string
    onUpload: (dataUrl: string) => void
    isUploading: boolean
}

export default function UploadAnswerModal({
    isOpen,
    onClose,
    studentName,
    isUploading,
    onUpload
}: UploadAnswerModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(f);
        }
    };

    const handleUpload = () => {
        if (preview) {
            onUpload(preview);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Upload Answer</h2>
                    <IconButton icon={X} onClick={onClose} size={20} className='p-2 rounded-full text-gray-400 hover:bg-gray-100' />
                </div>
                <p className="text-sm text-gray-600 mt-2">For student: <span className="font-semibold">{studentName}</span></p>

                <div className="mt-6">
                    <label htmlFor="file-upload" className="w-full h-48 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {preview ? (
                            <img src={preview} alt="Submission preview" className="max-h-44 object-contain rounded-md" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <FileImage size={40} className="mx-auto" />
                                <span className="mt-2 block font-medium">Click to upload image or PDF</span>
                                <span className="mt-1 block text-xs">PNG, JPG, or PDF</span>
                            </div>
                        )}
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
                    </label>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t mt-6">
                    <Button
                        color='white'
                        onClick={onClose}
                        disabled={isUploading}
                        title='Cancel'
                    />
                    <Button
                        color='blue'
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        title='Upload'
                        isSaving={isUploading}
                    />
                </div>
            </div>
        </div>
    );
}