import api from "../axios";

export async function deleteClassHomework(class_homework_id:string) {
    try {
        const res = await api.delete(`/delete_class_homework?class_homework_id=${class_homework_id}`);
        console.log('Unassign homework from class response:', res);
        return res;
    } catch (error) {
        console.error("Failed to unassign homework:", error);
        throw error;
    }
}