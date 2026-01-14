import React, { useState, useRef, useEffect } from 'react';
import { loadModelFaceApi, tinyFaceDetectorOptions } from '@/utils/face-recognition/loadModelFaceApi';
import * as faceapi from 'face-api.js';
import api from '@/lib/axios';
import { AlertTriangle, CheckCircle, Loader2, ScanFace, Upload, X } from 'lucide-react';
import IconButton from '../IconButton/IconButton';
import Button from '../Button/Button';

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

    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const [statusMessage, setStatusMessage] = useState<string>('Initializing AI...');
    const [statusType, setStatusType] = useState<'loading' | 'success' | 'error' | 'idle'>('loading');

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const init = async () => {
            setStatusType('loading');
            setStatusMessage('Loading Face Recognition Models...');

            const success = await loadModelFaceApi();

            if (success) {
                setIsModelLoaded(true);
                setStatusType('idle');
                setStatusMessage('Ready. Please upload a clear photo.');
            } else {
                setStatusType('error');
                setStatusMessage('Failed to load AI models. Please refresh.');
            }
        };
        init();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setPreviewUrl(null);
            setSelectedFile(null);
            setDescriptor(null);
            setStatusType('idle');
            setStatusMessage('');
        }
    }, [isOpen]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            setIsDetecting(true);
            setDescriptor(null);
            setStatusType('loading');
            setStatusMessage('Detecting face...');
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
                setStatusType('success');
                setStatusMessage('Face detected successfully!');
            } else {
                setDescriptor(null);
                setStatusType('error');
                setStatusMessage('No face found. Please use a clearer photo.');
            }
        } catch (error) {
            console.error(error);
            setStatusType('error');
            setStatusMessage('Error during face detection.');
        } finally {
            setIsDetecting(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || !descriptor) return;
        setIsRegistering(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('descriptor', JSON.stringify(Array.from(descriptor)));
            formData.append('student_id', student.id);

            const response = await api.post('/api/register-student', { formData });

            if (response.status === 200) {
                onSuccess();
                onClose();
            } else {
                throw new Error('Upload failed.');
            }
        } catch (error) {
            console.error(error);
            setStatusType('error');
            setStatusMessage('Failed to save to server.');
        } finally {
            setIsRegistering(false);
        }
    };


    if (!isOpen) {
        return;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <ScanFace className="text-indigo-600" /> Face Registration
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Registering: <span className="font-semibold">{student.name}</span></p>
                    </div>

                    <IconButton icon={X} onClick={onClose} size={20} />
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">

                    {/*Status */}
                    <div className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium border ${statusType === 'loading' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        statusType === 'success' ? 'bg-green-50 text-green-700 border-green-100' :
                            statusType === 'error' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-gray-50 text-gray-700 border-gray-100'
                        }`}>
                        {statusType === 'loading' && <Loader2 size={18} className="animate-spin" />}
                        {statusType === 'success' && <CheckCircle size={18} />}
                        {statusType === 'error' && <AlertTriangle size={18} />}
                        {statusMessage}
                    </div>

                    {/*Image reiew and Upload*/}
                    <div className="aspect-[4/3] w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">

                        {previewUrl ? (
                            <>
                                <img
                                    ref={imgRef}
                                    src={previewUrl}
                                    alt="Preview"
                                    onLoad={handleImageLoad}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isDetecting ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                                />
                                {isDetecting && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                            <Loader2 size={16} className="animate-spin" /> Scanning...
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <p className="text-gray-900 font-medium">Click to upload a photo</p>
                                <p className="text-gray-500 text-xs mt-1">JPG or PNG. Ensure face is clearly visible.</p>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={!isModelLoaded || isDetecting}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        color='white'
                        title='Cancel'
                    />

                    <Button
                        title={isRegistering ? 'Registering...' : 'Confirm Registration'}
                        disabled={!descriptor || isRegistering || isDetecting}
                        onClick={handleSubmit}
                        color='blue'
                    />
                </div>

            </div>
        </div>
    );
}