import { fetchStudentHomeworkQuestionByClassHomeworkId } from "@/lib/api/fetchStudentHomeworkQuestionByStudentHomeworkId"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentHomeworkQuestionByClassHomeworkId = (class_homework_id: string) => {
    return useQuery({
        queryKey: ["student_homework_question_by_class_homework_id", class_homework_id],
        queryFn: () => fetchStudentHomeworkQuestionByClassHomeworkId(class_homework_id),
        enabled: !!class_homework_id,
    })
}