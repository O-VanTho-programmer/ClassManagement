import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsUploadSubmission = {
    files: File[];
    student_homework_id: string;
    due_date: string;
    securityStatus?: 'Verified' | 'Unverified' | 'None';
}

export const useUploadSubmissionMutation = (
    getUrlImageByUploadOnCloudiary: (files: File[]) => Promise<ResultUpload[]>,
    saveStudentSubmission: (studentHomeworkId: string, dueDate: string, submissionDataUrls: ResultUpload[], securityStatus?: 'Verified' | 'Unverified' | 'None') => Promise<any>,
    invalidateKey?: any[]
) => {
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async ({ files, student_homework_id, due_date, securityStatus }: ParamsUploadSubmission) => {
            const resDataUrls: ResultUpload[] = await getUrlImageByUploadOnCloudiary(files);
            return saveStudentSubmission(student_homework_id, due_date, resDataUrls, securityStatus);
        },
        onSuccess: () => {
            if (invalidateKey) {
                queryClient.invalidateQueries({ queryKey: invalidateKey });
            }
        }
    });

    return uploadMutation;
}