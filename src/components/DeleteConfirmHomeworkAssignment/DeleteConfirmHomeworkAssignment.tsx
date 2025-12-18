import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useAlert } from '../AlertProvider/AlertContext';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { deleteClassHomework } from '@/lib/api/deleteClassHomeworkAPI';
import IconButton from '../IconButton/IconButton';

type DeleteConfirmHomeworkAssignmentProps = {
    isOpen: boolean;
    onClose: () => void;
    assignment: ClassHomework,
}

function DeleteConfirmHomeworkAssignment({
    isOpen,
    onClose,
    assignment,
}: DeleteConfirmHomeworkAssignmentProps) {

    const queryClient = useQueryClient();
    const { showAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: (class_homework_id: string) => deleteClassHomework(class_homework_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homework_by_class_id', assignment.class_id] });
            showAlert('Homework unassigned successfully.', 'success');
            onClose();
        },
        onError: (error: Error) => {
            showAlert(`Error: ${error.message}`, 'error');
        }
    });

    const handleDelete = () => {
        if (!assignment) return;
        mutation.mutate(assignment.class_homework_id);
    };

    if (!isOpen || !assignment) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Aware</h2>
                    <IconButton
                        icon={X}
                        onClick={onClose}
                        size={20}
                    />
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Are you sure?
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-4">
                                    You are about to unassign this homework from class:
                                    <br />
                                    <strong className="text-gray-800 break-words">"{assignment.title}"</strong>
                                </p>

                                <p>Assigned Date: {assignment.assigned_date}</p>
                                <p>Due Date: {assignment.due_date}</p>

                                <p className="text-sm font-bold text-red-700 mt-4">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={mutation.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
                    >
                        {mutation.isPending ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                        ) : (
                            <Trash2 size={16} className="mr-2" />
                        )}
                        {mutation.isPending ? 'Deleting...' : 'Delete Homework'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmHomeworkAssignment