import { fetchStudentListByClassId } from "@/lib/api/fetchStudentListByClassId";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentListByClassId(classId: string){
    return(useQuery({
        queryKey: ["getStudentListByClassId", classId],
        queryFn: () => fetchStudentListByClassId(classId),
        staleTime: 1000 * 60 * 5,
        enabled: !!classId,
    }))
}