import { ClassData } from "@/types/ClassData";
import api from "../axios";

export async function newClassAPI (newClassData: Omit<ClassData, 'id'>, hubId: string) {
    try {
        // Flatten the data structure to match what the API expects
        const requestBody = {
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
        
        const res = await api.post('new_class', requestBody);
        return res;
    } catch (error) {
        console.error("Error creating class:", error);
        throw error;
    }
}