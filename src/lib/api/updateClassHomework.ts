import api from "../axios";

export async function updateClassHomeworkDate(class_homework_id: string, due_date: string, assigned_date: string){
    try {
        const res = await api.put(`/update_class_homework_date`, {class_homework_id, due_date, assigned_date});
        console.log(res);
        return res;
    } catch (error) {
        console.error("Failed to update teacher:", error);
        throw error;
    }
}