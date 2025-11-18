import { ArrowLeft, Edit3, Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";

interface ModalEditAttendanceProps {
    studentAttendance: StudentAttendance;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedStudent: StudentAttendance) => void;
    isSaving?: boolean;
    classHomeworkList: ClassHomework[];
}

export function ModalEditAttendance({ studentAttendance, isOpen, onClose, onSave, isSaving, classHomeworkList }: ModalEditAttendanceProps) {
    const [editData, setEditData] = useState<StudentAttendance>(studentAttendance);

    console.log(studentAttendance)

    const assignedHomework = studentAttendance.assignments;


    useEffect(() => {
        setEditData(studentAttendance);
    }, [studentAttendance]);


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

        }));
    };

    const handleSave = () => {
        onSave(editData)
    };


    const attendanceButtons = [
        { status: 'Present', label: 'Present', color: 'green' },
        { status: 'Absent', label: 'Absent', color: 'red' },
        { status: 'Late', label: 'Late', color: 'yellow' },
        { status: 'Excused', label: 'Excused', color: 'blue' },
    ];


    return (
        <div
            className="fixed overlay inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
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
                            <p className="text-lg font-bold text-gray-900">{studentAttendance.name}</p>
                            <p className="text-sm text-gray-500">ID: {studentAttendance.id}</p>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Homework Submissions
                        </label>
                        {/* No longer needs loading/error states, as data is passed via props */}
                        {assignedHomework === undefined || assignedHomework.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No homework was assigned for this day.</p>
                        ) : (
                            <div className="space-y-3 rounded-md border border-gray-200 p-3">
                                {assignedHomework.map((hw) => (
                                    <div
                                        key={hw.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                                    >
                                        {/* LEFT SIDE: Checkbox + Title */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                id={String(hw.id)}
                                                type="checkbox"
                                                checked={!!hw.submitted_date}
                                                className="h-5 w-5 cursor-pointer text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                disabled
                                            />

                                            <label
                                                htmlFor={String(hw.id)}
                                                className="text-sm font-medium text-gray-800 cursor-pointer"
                                            >
                                                {hw.title}
                                            </label>
                                        </div>

                                        {/* RIGHT SIDE: Status */}
                                        <div className="flex items-center gap-2">
                                            {hw.status === "Pending" && (
                                                <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                                                    Pending
                                                </span>
                                            )}

                                            {hw.status === "Submitted" && (
                                                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                    ✓ Submitted
                                                </span>
                                            )}

                                            {hw.status === "Graded" && (
                                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                    ✓ Submitted
                                                </span>
                                            )}

                                            {hw.status === "Late" && (
                                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                                    Late
                                                </span>
                                            )}

                                            {hw.status === "Missed" && (
                                                <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                                                    Missed
                                                </span>
                                            )}

                                            {/* Submitted Date */}
                                            {hw.submitted_date && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDateForCompare(hw.submitted_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                ))}
                            </div>
                        )}
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