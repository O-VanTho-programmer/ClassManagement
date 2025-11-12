import api from "../axios";

export async function updateHomework(title: string, content: string, homeworkId: string) {
    try {
        const res = await api.put('/update_homework', { title, content, homeworkId });
        console.log('Update homework response:', res);
        return res;
    } catch (error) {
        console.error('Failed to update homework:', error);
        throw error;
    }
}