import { fetchStudentListByAssignmentIdPublic } from "@/lib/api/fetchStudentListByAssignmentIdPublic";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentListByAssignmentIdPublic(public_id:string){
    return useQuery({
        queryKey: ["get_student_list_by_assignment_id", public_id],
        queryFn: () => fetchStudentListByAssignmentIdPublic(public_id),
        staleTime: 0, 
        enabled: !!public_id
    })
}