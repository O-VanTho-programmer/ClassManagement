import api from "../axios";

export async function updateUserPermissionInHub(selectedPermissions: string[], teacherId: string, hubId: string) {
    try {
        const res = await api.put(`/update_user_permission_in_hub`, { selectedPermissions, teacherId, hubId });
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}