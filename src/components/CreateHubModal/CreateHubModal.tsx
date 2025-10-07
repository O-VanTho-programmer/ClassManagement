import { PlusSquare, X } from "lucide-react";
import { useState } from "react";
import Button from "../Button/Button";

interface CreateHubModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (hubData: HubAddDto) => void;
}

export default function CreateHubModal({ isOpen, onClose, onSubmit }: CreateHubModalProps) {
    const [formData, setFormData] = useState<HubAddDto>({
        Name: '',
        Description: '',
        IncludedTeachers: [],
        Owner: 'Current User'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.Name.trim()) newErrors.Name = 'Hub name is required';
        if (!formData.Description.trim()) newErrors.Description = 'Description is required';
        if (formData.Description.length < 10) newErrors.Description = 'Description should be at least 10 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            setFormData({
                Name: '',
                Description: '',
                IncludedTeachers: [],
                Owner: 'Current User'
            });
        }
    };

    const handleAddTeacher = () => {

    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 overlay flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Hub</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hub Name *
                        </label>
                        <input
                            type="text"
                            value={formData.Name}
                            onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.Name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter hub name"
                        />
                        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.Description}
                            onChange={(e) => setFormData(prev => ({ ...prev, Description: e.target.value }))}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.Description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Describe the purpose of this hub..."
                        />
                        {errors.Description && <p className="text-red-500 text-sm mt-1">{errors.Description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teachers
                            </label>
                            <span className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                {formData.IncludedTeachers.length}
                            </span>
                        </div>

                        <Button color="blue" icon={PlusSquare} title="Add Teacher" onClick={handleAddTeacher} />
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
                            Create Hub
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
