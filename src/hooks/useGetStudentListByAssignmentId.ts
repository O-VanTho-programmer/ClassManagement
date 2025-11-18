import { fetchStudentListByAssignmentId } from "@/lib/api/fetchStudentListByAssignmentId";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentListByAssignmentId(assignmentId:string){
    return useQuery({
        queryKey: ["get_student_list_by_assignment_id", assignmentId],
        queryFn: () => fetchStudentListByAssignmentId(assignmentId),
        staleTime: 0, 
        enabled: !!assignmentId
    })
}