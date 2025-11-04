import { ClassData } from "@/types/ClassData";
import api from "../axios";

export async function fetchClassByUserId(userId: string): Promise<ClassData[]> {
    try {
        const res = await api.get(`/get_class_by_user_id?userId=${userId}`);
        console.log('Fetch classes response:', res);
        return res.data.classData as ClassData[];
    } catch (error) {
        return [];
    }
}