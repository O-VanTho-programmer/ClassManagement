import { useGetClassesByHubIdQuery } from '@/hooks/useGetClassesByHubIdQuery';
import { assignHomework } from '@/lib/api/assignHomework';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, BookOpen, Calendar, CheckCircle2, Clock, Loader2, Users, X } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import SquareButton from '../SquareButton/SquareButton';
import Button from '../Button/Button';
import { useAlert } from '../AlertProvider/AlertContext';

type AssignHomeworkToClassModalProps = {
    curHomework: Homework,
    hubId: string,
    isOpen: boolean,
    onClose: () => void,
}

type ClassHomeworkDate = {
    assignedDate: string;
    dueDate: string;
}

export default function AssignHomeworkToClassModal({
    curHomework: homework,
    hubId,
    isOpen,
    onClose,
}: AssignHomeworkToClassModalProps) {

    const queryClient = useQueryClient();
    const { showAlert } = useAlert();
    const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set());

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesByHubIdQuery(hubId);
    const [classWithHomeworkDate, setClassWithHomeworkDate] = useState<Map<string, ClassHomeworkDate>>(new Map());

    const mutation = useMutation({
        mutationFn: (data: HomeworkAssignedClassesDTO) => assignHomework(data),
        onSuccess: (_, { class_id}) => {
            showAlert('Homework assigned successfully!', 'success');

            queryClient.invalidateQueries({ queryKey: ['homework_by_class_id', class_id] })
            queryClient.invalidateQueries({ queryKey: ['homeworkList', hubId] })
            handleClose();
        },
        onError: (error) => {
            showAlert(`Error assigning homework: ${error.message}`, 'error');
        }
    });

    const handleClose = () => {
        setSelectedClassIds(new Set());
        onClose();
    };

    const handleClassToggle = (classId: string) => {
        const newSet = new Set(selectedClassIds);
        const newMap = new Map(classWithHomeworkDate);

        if (newSet.has(classId)) {
            newSet.delete(classId);
            newMap.delete(classId);
        } else {
            newSet.add(classId);
            newMap.set(classId, {
                assignedDate: new Date().toISOString().split('T')[0],
                dueDate: ''
            })
        }

        setSelectedClassIds(newSet);
        setClassWithHomeworkDate(newMap);
    };

    const setAssignedDate = (classId: string, date: string) => {
        setClassWithHomeworkDate(prevMap => {
            const newMap = new Map(prevMap);
            const currentDates = newMap.get(classId);
            if (currentDates) {
                newMap.set(classId, { ...currentDates, assignedDate: date });
            }
            return newMap;
        });
    };

    const setDueDate = (classId: string, date: string) => {
        setClassWithHomeworkDate(prevMap => {
            const newMap = new Map(prevMap);
            const currentDates = newMap.get(classId);
            if (currentDates) {
                newMap.set(classId, { ...currentDates, dueDate: date });
            }
            return newMap;
        });
    };

    const isFormValid = useMemo(() => {
        if (selectedClassIds.size === 0) return false;
        for (const classId of selectedClassIds) {
            const dates = classWithHomeworkDate.get(classId);
            if (!dates || !dates.assignedDate || !dates.dueDate) {
                return false;
            }
        }
        return true;
    }, [selectedClassIds, classWithHomeworkDate]);


    const handleSelectAllClasses = () => {
        if (selectedClassIds.size === allClasses.length) {
            setSelectedClassIds(new Set());
            setClassWithHomeworkDate(new Map());
        } else {
            const newSet = new Set<string>();
            const newMap = new Map<string, ClassHomeworkDate>();

            allClasses.forEach(cls => {
                newSet.add(cls.id);
                newMap.set(cls.id, {
                    assignedDate: new Date().toISOString().split('T')[0],
                    dueDate: ''
                });
            });

            setSelectedClassIds(newSet);
            setClassWithHomeworkDate(newMap);
        }
    };

    const handleSubmit = async () => {
        if (!homework) return;
        if (selectedClassIds.size === 0) {
            showAlert('Please select at least one class.', 'error');
            return;
        }

        const assignmentsToSubmit: HomeworkAssignedClassesDTO[] = [];

        for (let classId of selectedClassIds) {
            const curItem = classWithHomeworkDate.get(classId);

            if (!curItem) {
                console.log("Miss Class Ids: " + classId);
                continue;
            }

            assignmentsToSubmit.push({
                homework_id: homework.id,
                class_id: classId,
                due_date: curItem.dueDate,
                assigned_date: curItem.assignedDate
            });
        }

        if (assignHomework.length === 0) {
            showAlert("No valid assignments to submit.", "warning");
            return;
        }

        try {
            await Promise.all(assignmentsToSubmit.map(item => mutation.mutateAsync(item)));
            handleClose();

        } catch (error) {
            showAlert(`Error assigning homework: ${(error as Error).message}. Please try again.`, 'error');
        }
    };

    if (!isOpen || !homework) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-white z-10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Assign Homework</h2>
                            <p className="text-sm text-gray-500 font-medium mt-0.5 line-clamp-1 pr-8">
                                {homework.title}
                            </p>
                        </div>
                    </div>
                    <SquareButton onClick={handleClose} color="gray" icon={X} />
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto bg-gray-50 p-6">

                    {isLoadingClasses ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <Loader2 size={32} className="animate-spin mb-2 text-indigo-500" />
                            <p className="text-sm">Loading classes...</p>
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {/* Select All Bar */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users size={18} className="text-gray-400" />
                                    <span className="font-semibold">Select Classes</span>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                                        Select All ({allClasses.length})
                                    </span>
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={allClasses.length > 0 && selectedClassIds.size === allClasses.length}
                                            onChange={handleSelectAllClasses}
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Class List */}
                            <div className="space-y-3">
                                {allClasses.map(cls => {
                                    const isSelected = selectedClassIds.has(cls.id);

                                    return (
                                        <div
                                            key={cls.id}
                                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${isSelected
                                                ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                                                : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'
                                                }`}
                                        >
                                            {/* Class Header (Clickable) */}
                                            <div
                                                className="p-4 flex items-center justify-between cursor-pointer"
                                                onClick={() => handleClassToggle(cls.id)}
                                            >
                                                <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                                                    {cls.name}
                                                </span>
                                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'bg-white border-gray-300'
                                                    }`}>
                                                    <CheckCircle2 size={14} className={`text-white ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                                </div>
                                            </div>

                                            {/* Date Inputs (Conditional) */}
                                            {isSelected && (
                                                <div className="px-4 pb-4 pt-2 bg-indigo-50/50 border-t border-indigo-100 grid grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                                            <Calendar size={14} className="text-indigo-500" /> Assigned Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={classWithHomeworkDate.get(cls.id)?.assignedDate || ''}
                                                            onChange={(e) => setAssignedDate(cls.id, e.target.value)}
                                                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                                            <Clock size={14} className="text-red-500" /> Due Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={classWithHomeworkDate.get(cls.id)?.dueDate || ''}
                                                            onChange={(e) => setDueDate(cls.id, e.target.value)}
                                                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-white z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm">
                        {!isFormValid && selectedClassIds.size > 0 ? (
                            <p className="flex items-center text-amber-600 font-medium animate-pulse">
                                <AlertTriangle size={16} className="mr-2" />
                                Please fill out dates for all selections
                            </p>
                        ) : (
                            <p className="text-gray-500">
                                <span className="font-bold text-gray-900">{selectedClassIds.size}</span> class{selectedClassIds.size !== 1 && 'es'} selected
                            </p>
                        )}
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <Button title="Cancel" onClick={handleClose} color="white" icon={X} />
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || mutation.isPending}
                            className="cursor-pointer flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            {mutation.isPending && <Loader2 size={18} className="animate-spin" />}
                            {mutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}