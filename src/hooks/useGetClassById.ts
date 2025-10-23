import { fetchClassById } from "@/lib/api/fetchClassById";
import { useQuery } from "@tanstack/react-query";

export function useGetClassById(classId: string) {
    return useQuery({
        queryKey: ['class', classId],
        queryFn: () => fetchClassById(classId),
        staleTime: 1000 * 60 * 5,
        enabled: !!classId,
    })
}