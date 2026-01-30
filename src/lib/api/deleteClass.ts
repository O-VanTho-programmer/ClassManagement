import api from "../axios";

export async function deleteClass(class_id: string, hub_id: string) {
    try {
        const res = await api.delete(`/delete_class?class_id=${class_id}&hub_id=${hub_id}`);
        console.log('Delete class response:', res);
        return res;
    } catch (error) {
        console.error("Failed to delete class:", error);
        throw error;
    }
}