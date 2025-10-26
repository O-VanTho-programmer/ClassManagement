import { fetchDateHasHomework } from "@/lib/api/fetchDateHasHomework";
import { useQuery } from "@tanstack/react-query";

export function useGetDateHasHomeworkQuery(classId: string) {
    return useQuery({
        queryKey: ['dateHasHomework', classId],
        queryFn: () => fetchDateHasHomework(classId),
        staleTime: 0, 
        enabled: !!classId,
    })
}