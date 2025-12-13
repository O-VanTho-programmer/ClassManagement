import api from "../axios";

export const addStudentHomeworkQuestion = async (studentHomeworkId: string, questions: StudentHomeworkQuestionsInputDTO[]) => {
    try {
        console.log(studentHomeworkId, questions);

        if (questions.length === 0) {
            console.error("Invalid input");
            throw new Error("Invalid input parameters");
        }

        const res = await api.post(`/add_student_homework_question`, { studentHomeworkId, questions });
        return res;
    } catch (error) {
        console.error("Failed to add student to class:", error);
        throw error;
    }
}