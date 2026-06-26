import api from "../axios";

export async function deleteHomework(homeworkId:string) {
    try {
        const res = await api.delete(`/delete_homework?homeworkId=${homeworkId}`);
        return res;
    } catch (error) {
        console.error("Failed to delete homework:", error);
        throw error;
    }
}