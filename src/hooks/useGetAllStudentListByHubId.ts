import { fetchAllStudentListByHubId } from "@/lib/api/fetchAllStudentListByHubId";
import { useQuery } from "@tanstack/react-query";

export function useGetAllStudentListByHubId(hubId: string, offset?: number, limit?: number, debouncedSearch?: any, status?: string) {
    return useQuery({
        queryKey: ['all_student_list_by_hub_id', hubId, offset, limit, debouncedSearch],
        queryFn: () => fetchAllStudentListByHubId(hubId, offset, limit, debouncedSearch, status),
        staleTime: 0, 
        enabled: !!hubId,
        placeholderData: (previousData) => previousData, 
    })
}