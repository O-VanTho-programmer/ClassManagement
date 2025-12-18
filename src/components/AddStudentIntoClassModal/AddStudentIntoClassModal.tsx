import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import DatePicker from "../DatePicker/DatePicker";
import { X } from "lucide-react";
import IconButton from "../IconButton/IconButton";
import Button from "../Button/Button";

interface AddStudentIntoClassModalProps {
    allStudentList: Student[] | undefined | null
    studentsAlreadyInClass: Student[] | undefined | null;
    isOpen: boolean;
    classId: string;
    onClose: () => void;
    onSubmit: (selectedStudentIds: string[], classId: string, enrollDate: string) => void;
}

export default function AddStudentIntoClassModal({
    allStudentList = [],
    studentsAlreadyInClass = [],
    isOpen,
    classId,
    onClose,
    onSubmit,
}: AddStudentIntoClassModalProps) {
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [enrollDate, setEnrollDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedStudents([]);
            setSearchTerm('');
            setEnrollDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const safeStudentList = allStudentList ?? [];
    const safeStudentsInClass = studentsAlreadyInClass ?? [];

    const filteredStudents = useMemo(() => {
        return safeStudentList.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !safeStudentsInClass.some(s => s.id === student.id)
        );
    }, [safeStudentList, safeStudentsInClass, searchTerm]);

    if (!isOpen) {
        return null;
    }

    if (allStudentList == null || allStudentList == undefined) return null;

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudents(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const handleSubmit = () => {
        onSubmit(selectedStudents, classId, enrollDate);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="absolute inset-0 overlay bg-opacity-50" onClick={onClose}></div>

            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] z-10 flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Add Students to Class</h2>
                    <IconButton
                        onClick={onClose}
                        icon={X}
                        size={20}
                    />
                </div>

                {/* Search and Select All */}
                <div className="p-6 border-b border-gray-200">
                    <SearchBar search_width_style="header-dashboard" />
                    <div className="mt-4">
                        <DatePicker
                            date={enrollDate}
                            isLabelAbsolute={false}
                            label="Enroll Date"
                            onChange={setEnrollDate}
                        />
                    </div>
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="select-all"
                            checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="select-all" className="ml-3 text-sm font-medium text-gray-700">
                            Select all ({selectedStudents.length} / {filteredStudents.length})
                        </label>
                    </div>
                </div>

                {/* Student List */}
                <div className="flex-grow overflow-y-auto p-6 space-y-3">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div
                                key={student.id}
                                className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${selectedStudents.includes(student.id)
                                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSelectStudent(student.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    readOnly
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No students found.</p>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <Button
                        title="Cancel"
                        onClick={onClose}
                        color="white"
                    />
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={selectedStudents.length === 0}
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Add {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Students
                    </button>
                </div>
            </div>
        </div>
    );
}