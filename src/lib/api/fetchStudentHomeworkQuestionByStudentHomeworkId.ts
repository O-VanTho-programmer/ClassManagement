import api from "../axios";

export async function fetchStudentHomeworkQuestionByClassHomeworkId(classHomeworkId:string): Promise<{total_question: number, students_homework_questions: StudentHomeworkQuestions[]} | null> {
    try {
        const res = await api.get(`/get_student_homework_question_by_student_homework_id?classHomeworkId=${classHomeworkId}`);
        
        console.log("Fetch Student Homework Question By Class Homework Id", res);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}