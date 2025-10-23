import { ClassData } from "@/types/ClassData";
import { UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import DatePicker from "../DatePicker/DatePicker";

interface NewStudentInHubModalProps {
    availableClassDatas: ClassData[] | undefined | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: StudentInputDto, selectedClassIds: string[]) => void;
}

export default function NewStudentInHubModal({
    availableClassDatas = [],
    isOpen,
    onClose,
    onSubmit
}: NewStudentInHubModalProps) {

    if (!isOpen) {
        return null;
    }

    const initialFormData: StudentInputDto = {
        name: '',
        birthday: '',
        enroll_date: '',
    };

    const [formData, setFormData] = useState<StudentInputDto>(initialFormData);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [classSearchTerm, setClassSearchTerm] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setSelectedClasses([]);
            setClassSearchTerm('');
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Student's name is required.";
        if (!formData.birthday) newErrors.birthday = "Birthday is required.";
        if (!formData.enroll_date) newErrors.enroll_date = "Enroll date is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const filteredAvailableClassList = useMemo(() => {
        const availableClassList = Array.isArray(availableClassDatas) ? availableClassDatas : [];

        return availableClassList.filter(cl =>
            cl.name.toLowerCase().includes(classSearchTerm.toLowerCase())
        )
    }, [availableClassDatas, classSearchTerm]);


    const handleInputChange = (field: keyof typeof initialFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSelectClass = (classId: string) => {
        setSelectedClasses(prev =>
            prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
        );
    };

    const handleSelectAllClasses = () => {
        if (selectedClasses.length === filteredAvailableClassList.length) {
            setSelectedClasses([]);
        } else {
            setSelectedClasses(filteredAvailableClassList.map(c => c.id));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData, selectedClasses);
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out`}
        >
            {/* Modal Overlay */}
            <div className="absolute inset-0 overlay bg-opacity-50" onClick={onClose}></div>

            {/* Modal Panel */}
            <div
                className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col z-50 transition-all duration-300 ease-in-out `}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Student</h2>
                    <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Basic Information Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                            type="text"
                            placeholder="Enter student's name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`md:w-1/2! input ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full input"
                            >
                                <option value="active">Active</option>
                                <option value="trial">Trial</option>
                                <option value="inactive">Inactive</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div> */}
                        <div className="">
                            <DatePicker date={formData.birthday} isLabelAbsolute={false} label="Birthday" onChange={(date) => handleInputChange('birthday', date)} />
                            {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
                        </div>
                        <div className="">
                            <DatePicker date={formData.enroll_date} isLabelAbsolute={false} label="Enroll Date" onChange={(date) => handleInputChange('enroll_date', date)} />
                            {errors.enroll_date && <p className="text-red-500 text-sm mt-1">{errors.enroll_date}</p>}
                        </div>

                    </div>

                    {/* Optional Class Assignment Section */}
                    {Array.isArray(availableClassDatas) && availableClassDatas.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add to Classes (Optional)</h3>
                            <SearchBar onChange={(e) => setClassSearchTerm(e.target.value)} search_width_style="header-dashboard" />
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="select-all-classes"
                                    checked={filteredAvailableClassList.length > 0 && selectedClasses.length === filteredAvailableClassList.length}
                                    onChange={handleSelectAllClasses}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="select-all-classes" className="ml-3 text-sm font-medium text-gray-700">
                                    Select all ({selectedClasses.length} / {filteredAvailableClassList.length})
                                </label>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                {filteredAvailableClassList.map(cls => (
                                    <div
                                        key={cls.id}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer ${selectedClasses.includes(cls.id) ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                                        onClick={() => handleSelectClass(cls.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedClasses.includes(cls.id)}
                                            readOnly
                                            className="h-4 w-4 text-blue-600 rounded pointer-events-none"
                                        />
                                        <p className="ml-3 font-medium text-gray-800">{cls.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={handleSubmit} className="btn-primary">
                        <UserPlus size={18} className="mr-2" />
                        Create Student
                    </button>
                </div>
            </div>

        </div>
    );
}