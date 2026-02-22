import { fetchStudentGradeBookByClassId } from "@/lib/api/fetchStudentGradeBookByClassId"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentGradeBookByClassId = (class_id: string, hub_id: string) => {
    return useQuery({
        queryKey: ["student_grade_book_by_class_id", class_id, hub_id],
        queryFn: () => fetchStudentGradeBookByClassId(class_id, hub_id),
        staleTime: 1000 * 60 * 5,
        enabled: !!class_id,
    })
}