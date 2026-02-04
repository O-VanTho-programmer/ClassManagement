import { fetchClassSimpleByHubId } from "@/lib/api/fetchClassSimpleByHubId";
import { useQuery } from "@tanstack/react-query";

export function useGetClassSimpleByHubId(hubId: string) {
    return useQuery({
        queryKey: ['getClassSimpleByHubId', hubId],
        queryFn: () => fetchClassSimpleByHubId(hubId),
        staleTime: 0, 
        enabled: !!hubId,
    })
}