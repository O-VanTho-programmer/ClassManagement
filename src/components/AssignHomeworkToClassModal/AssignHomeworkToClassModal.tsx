import { useGetClassById } from '@/hooks/useGetClassById';
import { useGetUserClassesQuery } from '@/hooks/useGetUserClassesQuery';
import { assignHomework } from '@/lib/api/assignHomework';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import React, { useState } from 'react'

type AssignHomeworkToClassModalProps = {
    curHomework: Homework,
    hubId: string,
    isOpen: boolean,
    onClose: () => void,
}

export default function AssignHomeworkToClassModal({
    curHomework: homework,
    hubId,
    isOpen,
    onClose,
}: AssignHomeworkToClassModalProps) {

    const queryClient = useQueryClient();
    const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set());
    const [dueDate, setDueDate] = useState('');
    const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetUserClassesQuery(hubId);


    const mutation = useMutation({
        mutationFn: (data: HomeworkAssignedClassesDTO) => assignHomework(data),
        onSuccess: () => {
            alert('Homework assigned successfully!');
            handleClose();
        },
        onError: (error) => {
            alert(`Error assigning homework: ${error.message}`);
        }
    });

    const handleClose = () => {
        setSelectedClassIds(new Set());
        setDueDate('');
        setAssignedDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    const handleClassToggle = (classId: string) => {
        setSelectedClassIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(classId)) {
                newSet.delete(classId);
            } else {
                newSet.add(classId);
            }
            return newSet;
        });
    };

    const handleSelectAllClasses = () => {
        if (selectedClassIds.size === allClasses.length) {
            setSelectedClassIds(new Set());
        } else {
            setSelectedClassIds(new Set(allClasses.map(c => c.id)));
        }
    };

    const handleSubmit = () => {
        if (!homework) return;
        if (selectedClassIds.size === 0) {
            alert('Please select at least one class.');
            return;
        }
        if (!dueDate) {
            alert('Please set a due date.');
            return;
        }

        mutation.mutate({
            homework_id: homework.id,
            class_ids: Array.from(selectedClassIds),
            due_date: dueDate,
            assigned_date: assignedDate
        });
    };

    if (!isOpen || !homework) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Assign Homework</h2>
                        <p className="text-sm text-gray-600">"{homework.title}"</p>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto mt-6 space-y-6">
                    {/* Class Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign to Classes</h3>
                        {isLoadingClasses ? (
                            <div className="py-6 flex justify-center"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
                        ) : (
                            <div className="border rounded-md">
                                <div className="p-3 border-b bg-gray-50">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedClassIds.size === allClasses.length}
                                            onChange={handleSelectAllClasses}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">Select all</span>
                                    </label>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {allClasses.map(cls => (
                                        <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                                            <label key={cls.id} className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClassIds.has(cls.id)}
                                                    onChange={() => handleClassToggle(cls.id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 text-sm text-gray-800">{cls.name}</span>
                                            </label>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                                                    <input
                                                        type="date"
                                                        value={assignedDate}
                                                        onChange={(e) => setAssignedDate(e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                                    <input
                                                        type="date"
                                                        value={dueDate}
                                                        onChange={(e) => setDueDate(e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                        Assign ({selectedClassIds.size})
                    </button>
                </div>
            </div>
        </div>
    );
}