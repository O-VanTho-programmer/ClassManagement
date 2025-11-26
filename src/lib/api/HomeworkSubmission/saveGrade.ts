import api from "@/lib/axios";

export async function saveGrade(studentHomeworkId: string, grade: number, feedback: string) {
    try {
        const res = await api.post('save_grade_feedback_homework', {
            studentHomeworkId,
            grade,
            feedback
        });
        
        console.log("Grade and feedback saved", res.data);
        return res.data;

    } catch (error) {
        console.log("Failed to save grade and feedback", error);
        return null;
    }
};