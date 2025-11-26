import api from "../axios";

export async function gradeStudentHomeworkUseAI(answerKey: string, images: ResultUpload[]) {
    try {
        const res = await api.post('/ai/grade', {
            answerKey,
            images
        })

        console.log(res.data);

        return res; 
    } catch (error) {
        console.log(error);
        return null;
    }
}