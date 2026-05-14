import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useRef } from 'react'
import { useAlert } from '../AlertProvider/AlertContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { updateHomework } from '@/lib/api/updateHomework';
import SquareButton from '../SquareButton/SquareButton';
import { X, Sparkles, Upload, FileText } from 'lucide-react';
import Button from '../Button/Button';
import axios from 'axios';

type EditHomeworkModalProps = {
    curHomework: Homework;
    hubId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditHomeworkModal({
    curHomework,
    hubId,
    isOpen,
    onClose,
}: EditHomeworkModalProps) {
    const { showAlert } = useAlert();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(curHomework.title);
    const [content, setContent] = useState(curHomework.content);
    const [answerKey, setAnswerKey] = useState(curHomework.answer_key || '');
    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update state when curHomework changes
    useEffect(() => {
        if (curHomework) {
            setTitle(curHomework.title);
            setContent(curHomework.content);
            setAnswerKey(curHomework.answer_key || '');
        }
    }, [curHomework]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const generateAIAnswerKey = async () => {
        if (selectedFiles.length === 0) {
            showAlert('Please upload at least one homework file (PDF/Word/Image) to generate a key.', 'error');
            return;
        }

        setGeneratingAI(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        formData.append('hubId', hubId);

        try {
            const res = await axios.post('/api/ai/generate-answer-key', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
                setAnswerKey(res.data.answerKey);
                showAlert('Answer key generated successfully!', 'success');
            }
        } catch (err) {
            console.error(err);
            showAlert('Failed to generate answer key with AI.', 'error');
        } finally {
            setGeneratingAI(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            showAlert('Please fill out all fields.', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await updateHomework(title, content, answerKey, curHomework.id);
            if (res?.status === 200) {
                showAlert('Homework updated successfully!', 'success');
                queryClient.invalidateQueries({ queryKey: ['homeworkList', hubId] });
                setLoading(false);
                onClose();
            } else {
                showAlert(res?.data?.message || 'Error updating homework.', 'error');
                setLoading(false);
            }
        } catch (err: any) {
            console.error(err);
            showAlert(err?.response?.data?.message || 'Error connecting to server.', 'error');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="max-w-4xl w-full mx-4 bg-white shadow-2xl rounded-2xl p-8 space-y-6 max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Homework</h2>
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">ID: {curHomework.id}</span>
                    </div>
                    <SquareButton onClick={onClose} color="gray" icon={X} />
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Homework Title</label>
                        <input
                            type="text"
                            placeholder="Homework Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Homework Description / Instructions</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200"
                            placeholder="Write your homework content here..."
                        />
                    </div>

                    {/* AI Answer Key Section */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-blue-600 w-5 h-5" />
                                <h3 className="text-lg font-bold text-blue-900">Answer Key</h3>
                            </div>
                            <button
                                onClick={generateAIAnswerKey}
                                disabled={generatingAI || selectedFiles.length === 0}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm"
                            >
                                {generatingAI ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Regenerate with AI
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">Upload files to update key</p>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100/50 transition-colors bg-white"
                                    >
                                        <Upload className="text-blue-400 w-8 h-8 mb-2" />
                                        <span className="text-sm text-blue-600 font-medium">Click to upload</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            multiple 
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,image/*"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">New Files ({selectedFiles.length})</p>
                                    <div className="bg-white rounded-xl border border-blue-100 p-2 min-h-[100px] max-h-[100px] overflow-y-auto">
                                        {selectedFiles.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                                                No new files selected
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                            <span className="text-xs text-blue-900 truncate">{file.name}</span>
                                                        </div>
                                                        <button onClick={() => removeFile(index)} className="text-blue-400 hover:text-red-500">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">Current Answer Key Content</p>
                                <ReactQuill
                                    theme="snow"
                                    value={answerKey}
                                    onChange={setAnswerKey}
                                    className="bg-white rounded-xl overflow-hidden border border-gray-200"
                                    placeholder="Enter or generate answer key..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <Button title="Cancel" onClick={onClose} color="white" icon={X} />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="cursor-pointer px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300"
                    >
                        {loading ? 'Updating...' : 'Update Homework'}
                    </button>
                </div>
            </div>
        </div>
    );
}