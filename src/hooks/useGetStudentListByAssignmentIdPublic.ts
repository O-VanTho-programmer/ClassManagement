import { fetchStudentListByAssignmentIdPublic } from "@/lib/api/fetchStudentListByAssignmentIdPublic";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentListByAssignmentIdPublic(assignmentId:string){
    return useQuery({
        queryKey: ["get_student_list_by_assignment_id", assignmentId],
        queryFn: () => fetchStudentListByAssignmentIdPublic(assignmentId),
        staleTime: 0, 
        enabled: !!assignmentId
    })
}