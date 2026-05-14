'use client';
import { newHomework } from '@/lib/api/newHomework';
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAlert } from '../AlertProvider/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, Upload, X, FileText } from 'lucide-react';
import axios from 'axios';

export default function CreateHomework({ hubId, currentUserId }: { hubId: string, currentUserId: string }) {
    const { showAlert } = useAlert();
    const queryClient = useQueryClient();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [answerKey, setAnswerKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            const res = await newHomework({
                hub_id: hubId, 
                title, 
                content, 
                answer_key: answerKey,
                created_by_user_id: currentUserId
            });

            if (res?.status === 200) {
                showAlert('Homework created successfully!', 'success');
                setTitle('');
                setContent('');
                setAnswerKey('');
                setSelectedFiles([]);
                setLoading(false);
                queryClient.invalidateQueries({ queryKey: ['homeworkList', hubId] });
            } else {
                showAlert('Error creating homework.', 'error');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            showAlert('Error connecting to server.', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Create New Homework</h2>
                <p className="text-gray-500">Provide details and optionally generate an answer key using AI.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Homework Title</label>
                    <input
                        type="text"
                        placeholder="e.g., Mathematics Quiz - Chapter 5"
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
                        placeholder="Write your homework content or instructions here..."
                    />
                </div>
            </div>

            {/* AI Answer Key Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-600 w-5 h-5" />
                        <h3 className="text-lg font-bold text-blue-900">Answer Key (Optional)</h3>
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
                                Generate with AI
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">Step 1: Upload homework file</p>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100/50 transition-colors bg-white"
                            >
                                <Upload className="text-blue-400 w-8 h-8 mb-2" />
                                <span className="text-sm text-blue-600 font-medium">Click to upload</span>
                                <span className="text-xs text-gray-400 mt-1">PDF, DOCX, or Images</span>
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
                            <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">Selected Files ({selectedFiles.length})</p>
                            <div className="bg-white rounded-xl border border-blue-100 p-2 min-h-[100px] max-h-[100px] overflow-y-auto">
                                {selectedFiles.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                                        No files selected
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
                        <p className="text-xs font-medium text-blue-800 uppercase tracking-wider">Step 2: Review/Edit Draft Answer Key</p>
                        <ReactQuill
                            theme="snow"
                            value={answerKey}
                            onChange={setAnswerKey}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200"
                            placeholder="The draft answer key will appear here..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
                >
                    {loading ? 'Creating...' : 'Create Homework'}
                </button>
            </div>
        </div>
    );
}
