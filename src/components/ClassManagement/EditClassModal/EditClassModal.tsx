import { ClassData } from "@/types/ClassData";
import { Schedule } from "@/types/Schedule";
import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import Selection, { Option } from "@/components/Selection/Selection";
import SquareButton from "@/components/SquareButton/SquareButton";
import Button from "@/components/Button/Button";
import { useValidateClassInfoForm } from "@/hooks/useValidateClassInfoForm";

interface EditClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: ClassData) => void;
    editingClass: ClassData | null;
    teacherList: Teacher[];
}

export default function EditClassModal({ isOpen, onClose, onSubmit, editingClass, teacherList }: EditClassModalProps) {
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toISOString().split('T')[0];
    };

    const initialFormState: ClassData = {
        id: '',
        name: '',
        schedule: [{ day: 'Monday', startTime: '', endTime: '' }],
        studentCount: 0,
        teacher: '',
        assistant: '',
        subject: '',
        tuition: '',
        tuitionType: 'Monthly',
        base: '',
        status: 'Active',
        startDate: '',
        endDate: '',
    };

    const [formData, setFormData] = useState<ClassData>(initialFormState);

    useEffect(() => {
        if (isOpen && editingClass) {
            setFormData({
                ...editingClass,
                startDate: formatDateForInput(editingClass.startDate),
                endDate: formatDateForInput(editingClass.endDate),
                schedule: editingClass.schedule.length > 0 ? editingClass.schedule : [{ day: 'Monday', startTime: '', endTime: '' }],
                teacher: teacherList.find(teacher => teacher.name.match(editingClass.teacher))?.id || '',
                assistant: editingClass.assistant
                    ? teacherList.find(teacher => teacher.name === editingClass.assistant)?.id ?? ''
                    : '',
            });
        } else if (!isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen, editingClass]);

    const teacherOptions: Option[] = useMemo(() => {
        return teacherList.map((teacher: Teacher) => ({
            label: teacher.name,
            value: teacher.id
        }));
    }, [teacherList]);

    const assistantOptions: Option[] = useMemo(() => {
        return teacherList
            .filter((teacher: Teacher) => teacher.id !== formData.teacher)
            .map((teacher: Teacher) => ({
                label: teacher.name,
                value: teacher.id
            }));
    }, [teacherList, formData.teacher]);

    const { errors, validateForm } = useValidateClassInfoForm(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    const addScheduleSlot = () => {
        setFormData(prev => ({
            ...prev,
            schedule: [...prev.schedule, { day: 'Monday', startTime: '', endTime: '' }]
        }));
    };

    const removeScheduleSlot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index)
        }));
    };

    const updateScheduleSlot = (index: number, field: keyof Schedule, value: string) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.map((session, i) =>
                i === index ? { ...session, [field]: value } : session
            )
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Class</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full p-1 hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter class name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter subject"
                            />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teacher *
                            </label>
                            <div className="w-full">
                                <Selection
                                    value={formData.teacher}
                                    placeholder="Select teacher"
                                    options={teacherOptions}
                                    onChange={(value) => setFormData(prev => {
                                        const newAssistant = prev.assistant === value ? '' : prev.assistant;
                                        return { ...prev, teacher: value, assistant: newAssistant };
                                    })}
                                />
                            </div>
                            {errors.teacher && <p className="text-red-500 text-sm mt-1">{errors.teacher}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assistant
                            </label>
                            <div className="w-full flex items-center gap-2">
                                <div className="flex-grow">
                                    <Selection
                                        value={formData.assistant || ''}
                                        placeholder="Select assistant (optional)"
                                        options={assistantOptions}
                                        onChange={(value) => setFormData(prev => ({ ...prev, assistant: value }))}
                                    />
                                </div>
                                {formData.assistant && (
                                    <SquareButton
                                        color="gray"
                                        icon={X}
                                        onClick={() => setFormData(prev => ({ ...prev, assistant: '' }))}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Schedule *
                            </label>
                            <button
                                type="button"
                                onClick={addScheduleSlot}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1"
                            >
                                + Add Time Slot
                            </button>
                        </div>

                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {formData.schedule.map((session, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <select
                                        value={session.day}
                                        onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                                        className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>

                                    <div className="flex gap-2 w-full sm:w-2/3">
                                        <div className="relative w-full">
                                            <input
                                                type="time"
                                                value={session.startTime}
                                                onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors[`schedule-startTime-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors[`schedule-startTime-${index}`] && <p className="text-red-500 text-xs mt-1 absolute">{errors[`schedule-startTime-${index}`]}</p>}
                                        </div>
                                        <span className="self-center text-gray-500">-</span>
                                        <div className="relative w-full">
                                            <input
                                                type="time"
                                                value={session.endTime}
                                                onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors[`schedule-endTime-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors[`schedule-endTime-${index}`] && <p className="text-red-500 text-xs mt-1 absolute">{errors[`schedule-endTime-${index}`]}</p>}
                                        </div>

                                        {formData.schedule.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeScheduleSlot(index)}
                                                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                title="Remove slot"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dates and Tuition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tuition Type
                            </label>
                            <select
                                value={formData.tuitionType}
                                onChange={(e) => setFormData(prev => ({ ...prev, tuitionType: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarter">Quarter</option>
                                <option value="Course">Course</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tuition Amount
                            </label>
                            <input
                                type="text"
                                value={formData.tuition}
                                onChange={(e) => setFormData(prev => ({ ...prev, tuition: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., $200/month"
                            />
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Base Location
                            </label>
                            <input
                                type="text"
                                value={formData.base}
                                onChange={(e) => setFormData(prev => ({ ...prev, base: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., Main Campus"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Finished' }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Finished">Finished</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button
                            onClick={onClose}
                            title="Cancel"
                            color="white"
                        />

                        <button
                            type="submit"
                            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}