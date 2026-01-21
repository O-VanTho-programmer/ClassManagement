import api from "../axios";

export async function gradeStudentHomeworkBatchUseAI(answerKey: string, submissions: StudentWithHomework[]) {
    try {
        const payload = submissions.map(sub => ({
            student_homework_id: sub.student_homework_id,
            submission_urls: sub.submission_urls
        }));

        const res = await api.post('/ai/grade-batch', {
            answerKey,
            submissions: payload
        });

        console.log("Batch Grading Response:", res.data);
        return res;
    } catch (error) {
        console.error("Error in gradeStudentHomeworkBatchUseAI:", error);
        return null;
    }
}