import { fetchAllStudentListByHubId } from "@/lib/api/fetchAllStudentListByHubId";
import { useQuery } from "@tanstack/react-query";

export function useGetAllStudentListByHubId(hubId: string) {
    return useQuery({
        queryKey: ['all_student_list_by_hub_id', hubId],
        queryFn: () => fetchAllStudentListByHubId(hubId),
        staleTime: 0, // Always refetch when invalidated
        enabled: !!hubId,
    })
}