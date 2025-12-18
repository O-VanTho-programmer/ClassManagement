import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react'
import { useAlert } from '../AlertProvider/AlertContext';
import ReactQuill from 'react-quill-new';
import { updateHomework } from '@/lib/api/updateHomework';
import SquareButton from '../SquareButton/SquareButton';
import { X } from 'lucide-react';
import Button from '../Button/Button';

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
    const [loading, setLoading] = useState(false);

    // Update state when curHomework changes
    useEffect(() => {
        if (curHomework) {
            setTitle(curHomework.title);
            setContent(curHomework.content);
        }
    }, [curHomework]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            showAlert('Please fill out all fields.', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await updateHomework(title, content, curHomework.id);
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
            <div className="max-w-3xl w-full mx-4 bg-white shadow-lg rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Homework</h2>
                    <SquareButton onClick={onClose} color="gray" icon={X} />
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Homework Title
                        </label>
                        <input
                            type="text"
                            placeholder="Homework Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className='max-w-3xl mx-auto'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            className="bg-white rounded-lg"
                            placeholder="Write your homework content here..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Button title="Cancel" onClick={onClose} color="white" icon={X} />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? 'Updating...' : 'Update Homework'}
                    </button>
                </div>
            </div>
        </div>
    );
}