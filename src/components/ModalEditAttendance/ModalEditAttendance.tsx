import { ArrowLeft, Edit3, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";

interface ModalEditAttendanceProps {
    student: StudentAttendance;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedStudent: StudentAttendance) => void;
}

export function ModalEditAttendance({ student, isOpen, onClose, onSave }: ModalEditAttendanceProps) {
    const [editData, setEditData] = useState<StudentAttendance>(student);
    const [isSaving, setIsSaving] = useState(false);

    // Reset local state when a new student is passed in or when modal opens
    useEffect(() => {
        setEditData(student);
    }, [student]);


    if (!isOpen) {
        return null;
    }

    // --- Local Handlers ---
    const handleToggleAttendance = (status: StudentAttendanceType) => {
        setEditData(prev => ({ ...prev, present: status }));
    };

    const handleScoreChange = (score: number) => {
        setEditData(prev => ({ ...prev, score: isNaN(score) ? 0 : score }));
    };

    const handleCommentChange = (comment: string) => {
        setEditData(prev => ({ ...prev, comment: comment }));
    };

    const handleToggleHomework = () => {
        setEditData(prev => ({
            ...prev,
            is_finished_homework: prev.is_finished_homework === true ? false : true
        }));
    };

    const handleSave = () => {
        setIsSaving(true);

        setTimeout(() => {
            onSave(editData);
            setIsSaving(false);
            onClose();
        }, 500);
    };


    const attendanceButtons = [
        { status: 'present', label: 'Present', color: 'green' },
        { status: 'absent', label: 'Absent', color: 'red' },
        { status: 'late', label: 'Late', color: 'yellow' },
        { status: 'excused', label: 'Excused', color: 'blue' },
    ];


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
            style={{backgroundColor: "rgba(0,0,0,0.5)"}}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <Edit3 className="w-5 h-5 text-blue-600" />
                        Edit Attendance
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition"
                    >
                        <X className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Student Info */}
                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <HeaderAvatar size="smaller" />
                        <div>
                            <p className="text-lg font-bold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">ID: {student.id}</p>
                        </div>
                    </div>

                    {/* 1. Attendance Toggle (from user snippet) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Attendance State</label>
                        <div className="flex flex-wrap gap-2">
                            {attendanceButtons.map(({ status, label, color }) => (
                                <button
                                    key={status}
                                    onClick={() => handleToggleAttendance(status as StudentAttendanceType)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 cursor-pointer 
                                        ${editData.present === status ?
                                            `bg-${color}-100 text-${color}-700 border-${color}-500` :
                                            'bg-transparent text-gray-500 border-gray-300'} 
                                        transition-colors hover:shadow-md`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Score Input (from user snippet) */}
                    <div>
                        <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                        <input
                            id="score"
                            type="number"
                            value={editData.score === null ? '' : editData.score}
                            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                            className="w-full h-10 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-900"
                            min="0"
                            max="100"
                        />
                    </div>

                    {/* 3. Homework Checkbox (from user snippet) */}
                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            id="homework"
                            type="checkbox"
                            checked={editData.is_finished_homework || false} // Treat undefined as false for the checkbox state
                            onChange={handleToggleHomework}
                            className="form-checkbox cursor-pointer h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="homework" className="text-sm font-medium text-gray-700">
                            Finished Homework
                        </label>
                    </div>

                    {/* 4. Comment Textarea */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Note / Feedback</label>
                        <textarea
                            id="comment"
                            value={editData.comment || ''}
                            onChange={(e) => handleCommentChange(e.target.value)}
                            placeholder="Add feedback or excuse for being absent..."
                            className="w-full h-20 text-sm border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        disabled={isSaving}
                    >
                        <ArrowLeft className="w-4 h-4 inline mr-1" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 text-sm cursor-pointer font-semibold text-white rounded-lg transition flex items-center justify-center 
                            ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}