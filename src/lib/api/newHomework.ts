import api from "../axios"

export const newHomework = async (homework: HomeworkInputDto) => {
    try {
        const res = await api.post(`/new_homework`, homework);
        console.log('Create homework response:', res);
        return res;
    } catch (error) {
        console.error("Failed to fetch hubs:", error);
        return null;
    }
}