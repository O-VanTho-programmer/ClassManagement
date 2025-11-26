import { fetchStudentHomeworkById } from "@/lib/api/fetchStudentHomeworkByIdAPI"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentHomeworkByIdQuery = (student_homework_id: string) => {
    return useQuery({
        queryKey: ["student_homework_by_id", student_homework_id],
        queryFn: () => fetchStudentHomeworkById(student_homework_id),
        enabled: !!student_homework_id,
    })
}