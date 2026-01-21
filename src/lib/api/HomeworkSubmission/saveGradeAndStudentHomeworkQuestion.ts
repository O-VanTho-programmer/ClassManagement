import api from "@/lib/axios";

export async function saveGradeAndStudentHomeworkQuestion(studentHomeworkId: string, grade: number, feedback: string, questions: StudentHomeworkQuestionsInputDTO[]) {
    try {
        const res = await api.post('save_grade_feedback_and_homework_question', {
            studentHomeworkId,
            grade,
            feedback,
            questions
        });

        console.log("Grade and feedback and homework questions saved", res.data);
        return res.data;

    } catch (error) {
        console.log("Failed to save grade and feedback", error);
        return null;
    }
}