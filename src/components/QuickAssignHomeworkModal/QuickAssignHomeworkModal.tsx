import { useGetHomeworkListQuery } from '@/hooks/useGetHomeworkListQuery';
import React, { useMemo, useState } from 'react'
import LoadingState from '../QueryState/LoadingState';
import ErrorState from '../QueryState/ErrorState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignHomework } from '@/lib/api/assignHomework';
import { useAlert } from '../AlertProvider/AlertContext';
import { Book, Calendar, CheckCircle2, Clock, Loader2, X } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';

type QuickAssignHomeworkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    hubId: string;
    assignedDate: string;
    classId: string;
}


export default function QuickAssignHomeworkModal({
    isOpen,
    onClose,
    hubId,
    classId,
    assignedDate,
}: QuickAssignHomeworkModalProps) {

    const { showAlert } = useAlert();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedHomeworkId, setSelectedHomeworkId] = useState<Set<string>>(new Set());
    const [homeworkDueDate, setHomeworkDueDate] = useState<Map<string, string>>(new Map());

    const { data: homeworkList = [], isLoading, isError, error } = useGetHomeworkListQuery(hubId);

    const mutation = useMutation({
        mutationFn: (data: HomeworkAssignedClassesDTO) => assignHomework(data),
        onError: (error: any) => {
            console.error("Failed to assign:", error);
        }
    });

    const filteredHomework = useMemo(() => {
        if (!homeworkList) return [];
        return homeworkList.filter((hw: Homework) =>
            hw.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [homeworkList, searchTerm]);



    const handleSubmit = async () => {
        if (selectedHomeworkId.size === 0) {
            showAlert('Please select at least one homework to assign.', 'success');
            return;
        }

        const assignmentsToSubmit: HomeworkAssignedClassesDTO[] = [];

        for (const homeworkId of selectedHomeworkId) {

            const dueDate = homeworkDueDate.get(homeworkId);

            if (!dueDate) {
                continue;
            }

            if (assignedDate >= dueDate) {
                showAlert(`Error: Due date cannot be before assigned date for one of your selections.`, 'error');
                return;
            }

            assignmentsToSubmit.push({
                class_id: classId,
                homework_id: homeworkId,
                due_date: dueDate,
                assigned_date: assignedDate
            });
        }

        try {
            await Promise.all(assignmentsToSubmit.map(data => mutation.mutateAsync(data)));

            queryClient.invalidateQueries({ queryKey: ['studentAttendanceRecords', classId] });
            showAlert(`Successfully assigned ${selectedHomeworkId.size} homework(s)!`, 'success');
            onClose();
        } catch (error) {
            showAlert("An error occurred while assigning homework. Please check the console.", 'error');
        }
    };

    const handleToggleSelect = (homework_id: string) => {
        const newSelectedHomeworkId = new Set(selectedHomeworkId);
        const newDueDateHomework = new Map(homeworkDueDate);

        if (newSelectedHomeworkId.has(homework_id)) {
            newSelectedHomeworkId.delete(homework_id);
            newDueDateHomework.delete(homework_id);
        } else {
            newSelectedHomeworkId.add(homework_id);
            newDueDateHomework.set(homework_id, new Date().toISOString().split('T')[0]);
        }

        setSelectedHomeworkId(newSelectedHomeworkId);
        setHomeworkDueDate(newDueDateHomework);
    }

    const handleDueDateChange = (id: string, newDate: string) => {
        const newDueDateHomework = new Map(homeworkDueDate);
        newDueDateHomework.set(id, newDate);
        setHomeworkDueDate(newDueDateHomework);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Quick Assign Homework</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Due Date: <span className="font-medium text-indigo-600">{new Date(assignedDate).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow flex flex-col overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-4 border-b">
                        <SearchBar
                            search_width_style="medium"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </div>

                    {/* Content State handling */}
                    {isLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <LoadingState message="Loading library..." />
                        </div>
                    ) : isError ? (
                        <div className="flex-grow flex items-center justify-center">
                            <ErrorState message={(error as Error)?.message || "Error loading homework"} />
                        </div>
                    ) : (
                        /* Homework List */
                        <div className="flex-grow overflow-y-auto p-4 space-y-2">
                            {filteredHomework.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No homework found.</p>
                            ) : (
                                filteredHomework.map((hw: Homework) => {
                                    const isSelected = selectedHomeworkId.has(hw.id);
                                    const curDueDate = homeworkDueDate.get(hw.id);

                                    return (
                                        <div
                                            key={hw.id}
                                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${isSelected
                                                ? 'border-indigo-500 bg-white ring-2 ring-indigo-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-indigo-300'
                                                }`}
                                        >
                                            {/* Clickable Header Area */}
                                            <div
                                                onClick={() => handleToggleSelect(hw.id)}
                                                className="flex items-center p-4 cursor-pointer"
                                            >
                                                <div className={`p-2.5 rounded-full mr-4 flex-shrink-0 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Book size={20} />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className={`font-semibold text-[15px] ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                                                        {hw.title}
                                                    </h4>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                                                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                                                </div>
                                            </div>

                                            {/* Expandable Date Selection Area */}
                                            {isSelected && curDueDate && (
                                                <div className="px-4 pb-4 pt-2 bg-indigo-50/50 border-t border-indigo-100 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center">
                                                        <Clock size={14} className="mr-1.5 text-red-500" />
                                                        Due Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={curDueDate}
                                                        onChange={(e) => handleDueDateChange(hw.id, e.target.value)}
                                                        className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedHomeworkId || mutation.isPending}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center"
                    >
                        {mutation.isPending && <Loader2 size={18} className="animate-spin mr-2" />}
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
}
