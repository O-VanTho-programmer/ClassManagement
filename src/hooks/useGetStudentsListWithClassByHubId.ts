import { fetchStudentsListWithClassByHubId } from "@/lib/api/fetchStudentsListWithClassByHubId";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentsListWithClassByHubId(hubId: string, offset?: number, limit?: number, debouncedSearch?: any, status?: string, classId?: string) {
    return useQuery({
        queryKey: ['all_student_list_with_class_by_hub_id', hubId, offset, limit, debouncedSearch, status, classId],
        queryFn: () => fetchStudentsListWithClassByHubId(hubId, offset, limit, debouncedSearch, status, classId),
        staleTime: 0, 
        enabled: !!hubId,
        placeholderData: (previousData) => previousData, 
    })
}