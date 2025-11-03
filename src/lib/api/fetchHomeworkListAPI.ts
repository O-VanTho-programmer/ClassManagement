import api from "../axios";

export async function fetchHomeworkListAPI(hubId: string): Promise<Homework[]> {
    try {
        const res = await api.get(`/get_homework_list_by_hub_id?hubId=${hubId}`);
        console.log('Fetch homework list response:', res);
        return res.data.homeworkList as Homework[];
    } catch (error) {
        console.log('Failed to fetch homework list', error);
        return [];
    }
}