import api from "../axios";

export async function fetchTeacherListByHubId(hubId:string) : Promise<Teacher[]> {
    try {
        const res = await api.get(`/get_teacher_list_by_hub_id?hubId=${hubId}`);
        console.log('Fetch teacher list response:', res);
        return res.data.teacherList as Teacher[];
    } catch (error) {
        console.log(error);
        return [] as Teacher[];

    }
}