import api from "@/lib/axios";

export async function approveAIGrade(studentHomeworkId: string) {
    try {
        const res = await api.post('approve_ai_grade', { studentHomeworkId });
        console.log("AI grade approved", res.data);
        return res.data;
    } catch (error) {
        console.log("Failed to approve AI grade", error);
        return null;
    }
}
