import { ClassData } from "@/types/ClassData";
import { UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import DatePicker from "../DatePicker/DatePicker";

interface NewStudentInHubModalProps {
    availableClassDatas: ClassData[] | undefined | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: StudentInputDto, classEnrollments: ClassEnrollmentDto[]) => void;
}

export default function NewStudentInHubModal({
    availableClassDatas = [],
    isOpen,
    onClose,
    onSubmit
}: NewStudentInHubModalProps) {

    const initialFormData: StudentInputDto = {
        name: '',
        birthday: '',
    };

    const [formData, setFormData] = useState<StudentInputDto>(initialFormData);
    const [selectedClasses, setSelectedClasses] = useState<ClassEnrollmentDto[]>([]);
    const [classSearchTerm, setClassSearchTerm] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', birthday: '' });
            setSelectedClasses([]);
            setClassSearchTerm('');
            setErrors({});
        }
    }, [isOpen]);

    const filteredAvailableClassList = useMemo(() => {
        const availableClassList = Array.isArray(availableClassDatas) ? availableClassDatas : [];

        return availableClassList.filter(cl =>
            cl.name.toLowerCase().includes(classSearchTerm.toLowerCase())
        )
    }, [availableClassDatas, classSearchTerm]);

    if (!isOpen) {
        return null;
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Student's name is required.";
        if (!formData.birthday) newErrors.birthday = "Birthday is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleInputChange = (field: keyof typeof initialFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSelectClass = (classId: string) => {
        const isSelected = selectedClasses.some(c => c.classId === classId);
        if (isSelected) {
            setSelectedClasses(prev => prev.filter(c => c.classId !== classId));
        } else {
            setSelectedClasses(prev => [...prev, { classId, enrollDate: new Date().toISOString().split('T')[0] }]);
        }
    };

    const handleEnrollDateChange = (classId: string, enrollDate: string) => {
        setSelectedClasses(prev => 
            prev.map(c => c.classId === classId ? { ...c, enrollDate } : c)
        );
    };

    const handleSelectAllClasses = () => {
        if (selectedClasses.length === filteredAvailableClassList.length) {
            setSelectedClasses([]);
        } else {
            setSelectedClasses(filteredAvailableClassList.map(c => ({ 
                classId: c.id, 
                enrollDate: new Date().toISOString().split('T')[0] 
            })));
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
                        <div className="">
                            <DatePicker date={formData.birthday} isLabelAbsolute={false} label="Birthday" onChange={(date) => handleInputChange('birthday', date)} />
                            {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
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
                                {filteredAvailableClassList.map(cls => {
                                    const isSelected = selectedClasses.some(c => c.classId === cls.id);
                                    const selectedClass = selectedClasses.find(c => c.classId === cls.id);
                                    
                                    return (
                                        <div
                                            key={cls.id}
                                            className={`p-3 rounded-lg border ${isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                                        >
                                            <div 
                                                className="flex items-center cursor-pointer"
                                                onClick={() => handleSelectClass(cls.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    readOnly
                                                    className="h-4 w-4 text-blue-600 rounded pointer-events-none"
                                                />
                                                <p className="ml-3 font-medium text-gray-800">{cls.name}</p>
                                            </div>
                                            
                                            {isSelected && (
                                                <div className="mt-3 ml-7">
                                                    <DatePicker 
                                                        date={selectedClass?.enrollDate || ''} 
                                                        isLabelAbsolute={false} 
                                                        label="Enroll Date" 
                                                        onChange={(date) => handleEnrollDateChange(cls.id, date)} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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