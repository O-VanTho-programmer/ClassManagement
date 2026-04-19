import api from "@/lib/axios";

export async function saveStudentSubmissionPublic(
    studentHomeworkId: string,
    dueDate: string,
    submissionDataUrls: ResultUpload[],
    securityStatus: 'Verified' | 'Unverified' | 'None' = 'None'
): Promise<any> {
    try {
        const res = await api.post('public/save_student_submission', {
            studentHomeworkId,
            dueDate,
            submissionDataUrls,
            securityStatus
        });

        console.log("Saving submission public", res.data);
        return res.data;
    } catch (error) {
        console.log("Saving submission public error", error);
        return null;
    }
}
