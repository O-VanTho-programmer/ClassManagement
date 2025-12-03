import api from "../axios";

export async function fetchClassHomeworkByHomeworkId(homeworkId:string): Promise<ClassHomeworkWithClassName[] | []> {
    try {
        const res = await api.get(`/get_class_homework_by_homework_id?homeworkId=${homeworkId}`);
        console.log('Fetch class homework by homework id response:', res);
        
        return res.data.class_homework as ClassHomeworkWithClassName[];
    } catch (error) {
        console.error("Failed to fetch class homework by homework id:", error);
        return [];
    }
}