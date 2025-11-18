import { fetchHomeworkById } from "@/lib/api/fetchHomeworkByIdAPI";
import { useQuery } from "@tanstack/react-query";

export function useGetHomeworkById(homeworkId: string) {
    return useQuery({
        queryKey: ['dateHasHomework', homeworkId],
        queryFn: () => fetchHomeworkById(homeworkId),
        staleTime: 0, 
        enabled: !!homeworkId,
    })
}