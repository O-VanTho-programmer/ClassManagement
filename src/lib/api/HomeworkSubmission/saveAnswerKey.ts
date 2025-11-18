import api from "@/lib/axios";

export async function saveAnswerKey(homeworkId: string, answerKey: string){
    try {
        const res = await api.post('save_answer_key_homework', {
            homeworkId,
            answerKey
        });

        console.log("Saving answer key for ${homeworkId}", res.data);
        return res.data;
    } catch (error) {
        console.log("Saving answer key for ${homeworkId}", error);
        return null;
    }
};