import { fetchStudentListByClassId } from "@/lib/api/fetchStudentListByClassId";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentListByClassId(classId: string){
    return(useQuery({
        queryKey: ["get_student_list_by_class_id", classId],
        queryFn: () => fetchStudentListByClassId(classId),
        staleTime: 0, // Always refetch when invalidated
        enabled: !!classId,
    }))
}