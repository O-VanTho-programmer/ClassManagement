import { ClassData } from "@/types/ClassData";
import api from "../axios";

export async function updateClassInfo(newClassData: ClassData, hubId: string) {
    try {
        const requestBody = {
            id: newClassData.id,
            name: newClassData.name,
            teacher: newClassData.teacher,
            assistant: (newClassData.assistant && newClassData.assistant) || null,
            subject: newClassData.subject,
            schedule: newClassData.schedule,
            tuition: (newClassData.tuition && newClassData.tuition) || null,
            tuitionType: newClassData.tuitionType,
            base: (newClassData.base && newClassData.base) || null,
            status: newClassData.status,
            startDate: newClassData.startDate,
            endDate: newClassData.endDate,
            hubId: hubId
        };
        const res = await api.put(`/update_class`, requestBody);
        console.log(res);
        return res;
    } catch (error) {
        console.error("Failed to update teacher:", error);
        throw error;
    }
}