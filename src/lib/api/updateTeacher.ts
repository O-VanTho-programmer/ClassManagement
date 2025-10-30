import api from "../axios";

export async function updateTeacherAPI(teacher: TeacherInHub, hubId: string){
    try {
        const res = await api.put(`/update_teacher`, {teacher, hubId});
        console.log(res);
        return res;
    } catch (error) {
        console.error("Failed to update teacher:", error);
        throw error;
    }
}