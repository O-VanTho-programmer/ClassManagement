import { X } from 'lucide-react';
import React from 'react'

type ViewHomeworkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    assignment: ClassHomework | null;
}

export default function ViewHomeworkModal({
    isOpen,
    onClose,
    assignment
}: ViewHomeworkModalProps) {
    if (!isOpen || !assignment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{assignment.title}</h2>
                    <button onClick={onClose} className="cursor-pointer p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto mt-6 prose prose-lg max-w-none">
                    {/* Render the full HTML content from the editor */}
                    <div dangerouslySetInnerHTML={{ __html: assignment.content }} />
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t">
                    <button type="button" onClick={onClose} className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}