import { HubRole } from "@/types/Hub";
import api from "../axios";

export async function updateTeacherRoleInHub(teacherId: string, hubId: string, role: HubRole){
    try {
        const res = await api.put(`/update_teacher_role`, { teacherId, hubId, role });
        console.log("Update teacher role response:", res);
        return res;
    } catch (error) {
        console.error("Failed to update teacher role:", error);
        throw error;
    }
}