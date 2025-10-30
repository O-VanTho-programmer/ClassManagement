import { fetchTeachersWorkload } from "@/lib/api/fetchTeachersWorkload";
import { useQuery } from "@tanstack/react-query";

export function useGetTeachersWorkload(hubId: string) {
    return useQuery({
        queryKey: ['teachers_workload', hubId],
        queryFn: () => fetchTeachersWorkload(hubId),
        enabled: !!hubId,
    });   
}