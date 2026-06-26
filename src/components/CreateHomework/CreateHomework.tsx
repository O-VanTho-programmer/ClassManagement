'use client';
import { newHomework } from '@/lib/api/newHomework';
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAlert } from '../AlertProvider/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, Upload } from 'lucide-react';
import axios from 'axios';

export default function CreateHomework({ hubId, currentUserId }: { hubId: string, currentUserId: string }) {
    const { showAlert } = useAlert();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [answerKey, setAnswerKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [parsingDoc, setParsingDoc] = useState(false);

    const docInputRef = useRef<HTMLInputElement>(null);

    const handleDocImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setParsingDoc(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('hubId', hubId);

            try {
                const res = await axios.post('/api/homework/parse-doc', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.status === 200 && res.data.html) {
                    setContent(res.data.html);
                    showAlert('Document imported successfully!', 'success');
                } else {
                    showAlert('Failed to import document.', 'error');
                }
            } catch (err: any) {
                console.error(err);
                const message = err.response?.data?.message || 'Error parsing document.';
                showAlert(message, 'error');
            } finally {
                setParsingDoc(false);
                if (docInputRef.current) {
                    docInputRef.current.value = ''; // Reset file input
                }
            }
        }
    };

    const generateAIAnswerKey = async () => {
        if (!content.trim() || content === '<p><br></p>') {
            showAlert('Please write or import some homework content first before generating an answer key.', 'error');
            return;
        }

        setGeneratingAI(true);

        try {
            const res = await axios.post('/api/ai/generate-answer-key-from-content', {
                content,
                hubId
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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Homework Description / Instructions</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => docInputRef.current?.click()}
                                disabled={parsingDoc}
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {parsingDoc ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-3.5 h-3.5" />
                                        Import from Word (.docx)
                                    </>
                                )}
                            </button>
                            <input
                                type="file"
                                ref={docInputRef}
                                onChange={handleDocImport}
                                accept=".docx"
                                className="hidden"
                            />
                        </div>
                    </div>
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
                        type="button"
                        onClick={generateAIAnswerKey}
                        disabled={generatingAI || !content.trim() || content === '<p><br></p>'}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm cursor-pointer"
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
                    <p className="text-xs text-blue-800">
                        Generate an initial draft answer key based on the homework content provided above. You can customize the AI-generated key directly in the editor below.
                    </p>

                    <div className="space-y-1">
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
