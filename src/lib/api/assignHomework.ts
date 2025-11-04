import api from "../axios";

export async function assignHomework(data: HomeworkAssignedClassesDTO) {
    try {
        const res = await api.post(`/assign_homework`, data);
        console.log("Assign homework response:", res);
        return res;
    } catch (error) {
        console.error("Failed to assign homework:", error);
        throw error;
    }
}