import { fetchClasses } from "@/lib/api/fetchClasses";
import { useQuery } from "@tanstack/react-query";

export function useGetClassesByHubIdQuery(hubId: string) {
    return useQuery({
        queryKey: ['userClasses', hubId],
        queryFn: () => fetchClasses(hubId),
        staleTime: 1000 * 60 * 5,
        enabled: !!hubId,
    })
}