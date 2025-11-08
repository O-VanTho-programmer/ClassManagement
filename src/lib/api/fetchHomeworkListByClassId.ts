import api from "../axios";

export async function fetchHomeworkListByClassId(classId:string) {
    try {
        const res = await api.get(`/get_homework_list_by_class_id?classId=${classId}`);
        console.log('Fetch homework by class id response:', res);
        return res.data.homeworkList;
    } catch (error) {
        console.error("Failed to fetch homework by class id:", error);
        return null;
    
    }
}