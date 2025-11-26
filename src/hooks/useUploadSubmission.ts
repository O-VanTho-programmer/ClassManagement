import { useMutation, useQueryClient } from "@tanstack/react-query";

type ParamsUploadSubmission = {
    files: File[];
    student_homework_id: string;
    due_date: string;
}

export const useUploadSubmissionMutation = (
    getUrlImageByUploadOnCloudiary: (files: File[]) => Promise<ResultUpload[]>,
    saveStudentSubmission: (studentHomeworkId: string, dueDate: string, submissionDataUrls: ResultUpload[]) => Promise<any>,
    invalidateKey?: any[]
) => {
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async ({ files, student_homework_id, due_date }: ParamsUploadSubmission) => {
            const resDataUrls: ResultUpload[] = await getUrlImageByUploadOnCloudiary(files);
            console.log(resDataUrls);
            return saveStudentSubmission(student_homework_id, due_date, resDataUrls);
        },
        onSuccess: () => {
            if (invalidateKey) {
                queryClient.invalidateQueries({ queryKey: invalidateKey });
            }
        }
    });

    return uploadMutation;
}