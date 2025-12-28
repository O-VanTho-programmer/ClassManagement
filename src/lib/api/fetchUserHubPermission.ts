import api from "../axios";

export async function fetchUserHubPermission(hubId:string, userId:string) {
    try {
        const res = await api.post(`/get_user_hub_permission_by_user_id`, {hubId, userId});
        console.log(res);
        return res.data.permissions;
    } catch (error) {
        console.log(error);
        return [];
    }
}