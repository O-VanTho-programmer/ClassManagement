import api from "../axios";

export async function addTeacherToHub (teacherId: string, hubId: string){
    try {
        const res = await api.post(`/add_teacher_to_hub`, {teacherId, hubId});
        console.log(res);
        return res;
    } catch (error) {
        console.error("Failed to add teacher to hub:", error);
        throw error;
    }
} 