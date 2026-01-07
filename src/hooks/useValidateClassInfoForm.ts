import { ClassData } from "@/types/ClassData";
import { useState } from "react";

export function useValidateClassInfoForm(formData: ClassData | Omit<ClassData, 'id'>) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Class name is required';
        if (!formData.teacher) newErrors.teacher = 'Teacher is required';
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

    return { errors, validateForm };
}