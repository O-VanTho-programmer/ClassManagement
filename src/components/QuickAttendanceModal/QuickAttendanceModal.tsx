import React, { useState, useEffect } from 'react';
import { X, UserCheck, UserX, Clock, Users } from 'lucide-react';
import { useAlert } from '../AlertProvider/AlertContext';
import { newAttendanceRecordsApi } from '@/lib/api/newAttendanceRecord';
import { useQueryClient } from '@tanstack/react-query';
import formatDateForCompare from '@/utils/Format/formatDateForCompare';
import formatDisplayDate from '@/utils/Format/formatDisplayDate';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import { newAttendanceRecordsList } from '@/lib/api/newAttendanceRecordsList';

interface StudentWithAttendanceRecordMap {
    recordsMap: Map<string, AttendanceRecord>;
    id: string;
    name: string;
    birthday: string | null;
    status: StudentStatus;
    total_present: number;
}

interface QuickAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    processedStudentDatas: StudentWithAttendanceRecordMap[];
    classId: string;
}

export default function QuickAttendanceModal({ isOpen, onClose, selectedDate, processedStudentDatas, classId }: QuickAttendanceModalProps) {
    const { showAlert } = useAlert();
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);
    const [studentWithAttendanceRecords, setStudentWithAttendanceRecords] = useState<StudentWithAttendanceRecordMap[]>(processedStudentDatas);
    const [editedRecordStudentIds, setEditedRecordStudentIds] = useState<Set<string> | null>(null);

    useEffect(() => {
        if (isOpen) {

        }
    }, [isOpen, processedStudentDatas, selectedDate]);

    const handleStatusChange = (studentId: string, status: StudentAttendanceType) => {
        const keyDate = formatDateForCompare(selectedDate);

        setStudentWithAttendanceRecords(prevStudents => {
            return prevStudents.map(student => {
                if (student.id !== studentId) return student;

                setEditedRecordStudentIds(prev => {
                    const newSet = new Set(prev || []);
                    newSet.add(studentId);
                    return newSet;
                })

                const updatedStudent = { ...student };

                updatedStudent.recordsMap = new Map(student.recordsMap);

                const prevData = updatedStudent.recordsMap.get(keyDate);

                if (prevData) {
                    updatedStudent.recordsMap.set(keyDate, {
                        ...prevData,
                        present: status,
                    });
                } else {
                    updatedStudent.recordsMap.set(keyDate, {
                        date: keyDate,
                        comment: null,
                        assignments: [],
                        score: null,
                        present: status,
                    });
                }

                return updatedStudent;
            });
        });
    };

    const handleMarkAll = (status: StudentAttendanceType) => {
        const keyDate = formatDateForCompare(selectedDate);

        setStudentWithAttendanceRecords(prevStudents => {
            return prevStudents.map(student => {

                setEditedRecordStudentIds(prev => {
                    const newSet = new Set(prev || []);
                    newSet.add(student.id);
                    return newSet;
                });

                const updatedStudent = { ...student };
                updatedStudent.recordsMap = new Map(student.recordsMap);

                const prevData = updatedStudent.recordsMap.get(keyDate);

                if (prevData) {
                    updatedStudent.recordsMap.set(keyDate, {
                        ...prevData,
                        present: status,
                    });
                } else {
                    updatedStudent.recordsMap.set(keyDate, {
                        date: keyDate,
                        comment: null,
                        assignments: [],
                        is_homework: undefined,
                        score: null,
                        present: status,
                    });
                }

                return updatedStudent;
            });
        });
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {

            console.log(editedRecordStudentIds);

            if (!editedRecordStudentIds) return;
            const updatedRecord: StudentAttendance[] = [];
            const keyDate = formatDateForCompare(selectedDate);

            studentWithAttendanceRecords.forEach(student => {
                if (editedRecordStudentIds.has(student.id)) {

                    const recordForDate = student.recordsMap.get(keyDate);

                    if (recordForDate) {
                        updatedRecord.push({
                            id: student.id,
                            name: student.name,
                            ...recordForDate
                        });
                    }
                }
            });

            if(!updatedRecord.length){
                showAlert("No updated data to save.", 'warning');
                return;
            }

            const res = await newAttendanceRecordsList(updatedRecord, classId);

            if (res?.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["studentAttendanceRecords", classId] });
                showAlert("Attendance saved successfully!", "success");
                onClose();
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            showAlert('An unexpected error occurred while saving.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const statusOptions: { status: StudentAttendanceType; label: string; icon: React.ElementType; color: string }[] = [
        { status: 'Present', label: 'Present', icon: UserCheck, color: 'bg-green-100 text-green-700' },
        { status: 'Absent', label: 'Absent', icon: UserX, color: 'bg-red-100 text-red-700' },
        { status: 'Late', label: 'Late', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <header className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Quick Attendance</h2>
                            <p className="text-sm text-gray-500">For {formatDisplayDate(selectedDate)}</p>
                        </div>
                    </div>
                    <IconButton
                        icon={X}
                        onClick={onClose}
                        size={20}
                    />
                </header>

                <div className="p-4 flex items-center justify-start gap-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Mark all as:</span>
                    {statusOptions.map(({ status, label }) => (
                        <button
                            key={status}
                            onClick={() => handleMarkAll(status)}
                            className={`cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-transform hover:scale-105 ${status === 'Present' ? 'bg-green-500 hover:bg-green-600 text-white' :
                                status === 'Absent' ? 'bg-red-500 hover:bg-red-600 text-white' :
                                    'bg-yellow-500 hover:bg-yellow-600 text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <main className="p-5 overflow-y-auto flex-grow">
                    <div className="space-y-2">
                        {studentWithAttendanceRecords.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-500 w-6 text-center">{index + 1}</span>
                                    <span className="font-medium text-gray-800">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {statusOptions.map(({ status, label, icon: Icon, color }) => (
                                        <button
                                            key={status}
                                            title={label}
                                            onClick={() => handleStatusChange(student.id, status)}
                                            className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${student.recordsMap.get(formatDateForCompare(selectedDate))?.present === status
                                                ? `${color} ring-2 ring-offset-1 ring-current`
                                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                }`}
                                        >
                                            <Icon size={18} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <footer className="flex gap-2 justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <Button
                        title='Cancel'
                        disabled={isSaving}
                        onClick={onClose}
                        color='white'
                    />

                    <Button
                        disabled={isSaving}
                        title={isSaving ? 'Saving...' : `Save`}
                        color='blue'
                        isSaving={isSaving}
                        onClick={handleSave}
                    />
                </footer>
            </div>
        </div>
    );
}