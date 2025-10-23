import { ClassData } from "@/types/ClassData";
import { Schedule } from "@/types/Schedule";
import { useState } from "react";

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: Omit<ClassData, 'id'>) => void;
}

export default function CreateClassModal({ isOpen, onClose, onSubmit }: CreateClassModalProps) {
    const [formData, setFormData] = useState<Omit<ClassData, 'id'>>({
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
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Class name is required';
        if (!formData.teacher.trim()) newErrors.teacher = 'Teacher is required';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        formData.schedule.forEach((session, index) => {
            if (!session.startTime) {
                newErrors[`schedule-startTime-${index}`] = 'Start time is required';
            }
            if (!session.endTime) {
                newErrors[`schedule-endTime-${index}`] = 'End time is required';
            }
            if (session.startTime && session.endTime && session.startTime >= session.endTime) {
                newErrors[`schedule-endTime-${index}`] = 'End time must be after start time';
            }
        });


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            setFormData({
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
            });
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
        <div className="fixed inset-0 overlay flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Class</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter subject"
                            />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teacher *
                            </label>
                            <input
                                type="text"
                                value={formData.teacher}
                                onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.teacher ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter teacher name"
                            />
                            {errors.teacher && <p className="text-red-500 text-sm mt-1">{errors.teacher}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assistant
                            </label>
                            <input
                                type="text"
                                value={formData.assistant}
                                onChange={(e) => setFormData(prev => ({ ...prev, assistant: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter assistant name (optional)"
                            />
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
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                            >
                                + Add Time Slot
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.schedule.map((session, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <select
                                        value={session.day}
                                        onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>

                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={session.startTime}
                                            onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`schedule-startTime-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[`schedule-startTime-${index}`] && <p className="text-red-500 text-xs mt-1 absolute">{errors[`schedule-startTime-${index}`]}</p>}
                                    </div>

                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={session.endTime}
                                            onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`schedule-endTime-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formData.schedule.length > 1 && (
                                            <button type="button" onClick={() => removeScheduleSlot(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                        {errors[`schedule-endTime-${index}`] && <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{errors[`schedule-endTime-${index}`]}</p>}
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Main Campus"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Finished' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Active">Active</option>
                            <option value="Finished">Finished</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Create Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
