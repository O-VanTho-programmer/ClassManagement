import React, { useState, useRef, useEffect } from 'react';
import { loadModelFaceApi, tinyFaceDetectorOptions } from '@/utils/face-recognition/loadModelFaceApi';
import * as faceapi from 'face-api.js';
import api from '@/lib/axios';

type FaceRegistryProps = {
    student: StudentWithFaceDescriptor;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function FaceRegistry({
    student,
    isOpen,
    onClose,
    onSuccess,
}: FaceRegistryProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [descriptor, setDescriptor] = useState<Float32Array | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('Loading AI libraries...');
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const init = async () => {
            const success = await loadModelFaceApi();

            if (success) {
                setStatus('AI libraries loaded!');
            }else{
                setStatus('Error loading AI libraries.');
            }

            setIsModelLoaded(success);
        };
        init();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setDescriptor(null);
            setStatus('Detecting face...');
        }
    };

    const handleImageLoad = async () => {
        if (!imgRef.current || !isModelLoaded) return;

        try {
            const detection = await faceapi
                .detectSingleFace(imgRef.current, tinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                setDescriptor(detection.descriptor);
                setStatus('Face detected! Ready to register.');
            } else {
                setStatus('No face detected. Please choose another photo.');
                setDescriptor(null);
            }
        } catch (error) {
            console.error(error);
            setStatus('Error during detection.');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || !descriptor) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('descriptor', JSON.stringify(Array.from(descriptor)));
            formData.append('student_id', student.id);

            const response = await api.post('/api/register-student', {
                body: formData,
            });

            if (response.status === 200) {
                setStatus('Registration successful!');
            } else {
                setStatus(`Error: ${response.data.error}`);
            }
        } catch (error) {
            setStatus('Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300'>
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Face Registration</h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!isModelLoaded}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50"
                />
                {previewUrl && (
                    <div className="relative">
                        <img
                            ref={imgRef}
                            src={previewUrl}
                            alt="Preview"
                            onLoad={handleImageLoad}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>
                )}

                <div className={`text-sm font-medium ${descriptor ? 'text-green-600' : 'text-blue-600'}`}>
                    Status: {status}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!descriptor || loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${!descriptor || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Processing...' : 'Register Student'}
                </button>
            </div>
        </div>
    );
}