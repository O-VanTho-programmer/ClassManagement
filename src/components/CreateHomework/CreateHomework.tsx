'use client';
import { newHomework } from '@/lib/api/newHomework';
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAlert } from '../AlertProvider/AlertContext';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateHomework({ hubId, currentUserId }: { hubId: string, currentUserId: string }) {
    const { showAlert } = useAlert();

    const queryClient = useQueryClient();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            showAlert('Please fill out all fields.', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await newHomework({hub_id: hubId, title, content, created_by_user_id: currentUserId});

            if (res?.status === 200) {
                showAlert('Homework created successfully!', 'success');
                setTitle('');
                setContent('');
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
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
            <input
                type="text"
                placeholder="Homework Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-white rounded-lg"
                placeholder="Write your homework content here..."
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Homework'}
            </button>
        </div>
    );
}
