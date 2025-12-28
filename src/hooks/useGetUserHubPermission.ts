import { fetchUserHubPermission } from "@/lib/api/fetchUserHubPermission";
import { useQuery } from "@tanstack/react-query";

export function useGetUserHubPermission(hubId: string, userId: string) {
    return useQuery({
        queryKey: ['user_hub_permission', hubId, userId],
        queryFn: () => fetchUserHubPermission(hubId, userId),
        enabled: !!hubId && !!userId,
    })
}