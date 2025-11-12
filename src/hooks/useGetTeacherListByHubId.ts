import { fetchTeacherListByHubId } from "@/lib/api/fetchTeacherListByHubId";
import { useQuery } from "@tanstack/react-query";

export function useGetTeacherListByHubId(hubId:string) {
    return useQuery({
        queryKey: ['teacher_list_by_hub_id', hubId],
        queryFn: () => fetchTeacherListByHubId(hubId),
        staleTime: 0, 
        enabled: !!hubId,
    })
}