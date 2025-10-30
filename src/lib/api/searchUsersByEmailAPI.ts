import api from "../axios"

export const searchUsersByEmailAPI = async (searchParams: string): Promise<Teacher[] | null>=> {
    try {
        const res = await api.get(`/search_users_by_email?email=${searchParams}`);
        console.log('Fetch teacher list response:', res);
        return res.data.teacherList as Teacher[] | [];
    } catch (error) {
        console.log(error);
        return [];
    }
}