import { getAllPermissions } from "@/lib/api/getAllPermissions";
import { useQuery } from "@tanstack/react-query";

export function useGetPermissions() {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: () => getAllPermissions()
    })
}