import { updateClassHomeworkDate } from '@/lib/api/updateClassHomework';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Button from '../Button/Button';

type EditAssignmentHomeworkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    assignment: ClassHomework | null;
}

export default function EditAssignmentHomeworkModal({
    isOpen,
    onClose,
    assignment
}: EditAssignmentHomeworkModalProps) {
    const queryClient = useQueryClient();
    const [assignedDate, setAssignedDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (assignment) {
            setAssignedDate(assignment.assigned_date);
            setDueDate(assignment.due_date);
        }
    }, [assignment]);

    const mutation = useMutation({
        mutationFn: () => updateClassHomeworkDate(assignment!.class_homework_id, assignedDate, dueDate),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['classHomework', assignment?.class_id] });
            alert('Assignment dates updated!');
            onClose();
        },
        onError: (error) => {
            alert(`Error updating dates: ${error.message}`);
        }
    });

    const handleSubmit = () => {
        if (new Date(dueDate) < new Date(assignedDate)) {
            alert('Due date cannot be before the assigned date.');
            return;
        }
        mutation.mutate();
    };

    if (!isOpen || !assignment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Assignment</h2>
                    <p className="text-sm text-gray-600">"{assignment.title}"</p>
                </div>

                <div className="flex-grow overflow-y-auto mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={14} className="inline mr-1.5" />
                                Assigned Date
                            </label>
                            <input
                                type="date"
                                value={assignedDate}
                                onChange={(e) => setAssignedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock size={14} className="inline mr-1.5" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-between gap-3 border-t">
                    <Button onClick={onClose} title='Delete' color='red_off' />
                    <div className='flex items-center gap-1'>
                        <Button onClick={onClose} title='Cancel' color='white' />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                        >
                            {mutation.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}