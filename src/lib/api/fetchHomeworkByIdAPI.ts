import api from "../axios";

export async function fetchHomeworkById(homeworkId:string): Promise<Homework | null> {
    try {
        const res = await api.get(`/get_homework_by_id?homeworkId=${homeworkId}`);
        console.log('Fetch homework by id response:', res);
        return res.data.homework as Homework;
    } catch (error) {
        console.error("Failed to fetch homework by id:", error);
        return null;   
    }
}