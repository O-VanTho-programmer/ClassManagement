import api from "../axios";

export async function fetchDateHasHomework(classId:string) {
    try {
        const res = await api.get(`/get_date_has_homework?classId=${classId}`);
        console.log('Fetch date has homework response:', res);
        return res.data.dateHasHomework;
    } catch (error) {
        console.error("Failed to fetch date has homework:", error);
        return null;
    }
}