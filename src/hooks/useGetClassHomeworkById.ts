import { fetchClassHomeworkById } from "@/lib/api/fetchClassHomeworkById";
import { useQuery } from "@tanstack/react-query";

export function useGetClassHomeworkById(assignmentId: string) {

    return useQuery({
        queryKey: ['get_class_homework_by_id', assignmentId],
        queryFn: () => fetchClassHomeworkById(assignmentId),
        staleTime: 1000 * 60 * 5,
        enabled: !!assignmentId,
    })
}