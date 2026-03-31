import api from "@/lib/axios";

export async function saveStudentSubmissionPublic(studentHomeworkId: string, dueDate: string, submissionDataUrls: ResultUpload[]): Promise<any> {
    try {
        const res = await api.post('public/save_student_submission', {
            studentHomeworkId,
            dueDate,
            submissionDataUrls
        });

        console.log("Saving submission public", res.data);
        return res.data;
    } catch (error) {
        console.log("Saving submission public error", error);
        return null;
    }
}
