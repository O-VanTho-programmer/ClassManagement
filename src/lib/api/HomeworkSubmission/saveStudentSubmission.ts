import api from "@/lib/axios";

export async function saveStudentSubmission(studentHomeworkId: string, dueDate: string, submissionDataUrls: ResultUpload[]): Promise<StudentWithHomework | null> {
    try {
        const res = await api.post('save_student_submission', {
            studentHomeworkId,
            dueDate,
            submissionDataUrls
        });

        console.log("Saving submission", res.data);
        return res.data;
    } catch (error) {
        console.log("Saving submission", error);
        return null;
    }
}