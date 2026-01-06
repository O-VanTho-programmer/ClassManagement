import { fetchClassHomeworkByIdPublic } from "@/lib/api/fetchClassHomeworkByIdPublic";
import { useQuery } from "@tanstack/react-query";

export function useGetClassHomeworkByIdPublic(assignmentId: string) {
    return useQuery({
        queryKey: ['get_class_homework_by_id_public', assignmentId],
        queryFn: () => fetchClassHomeworkByIdPublic(assignmentId),
        staleTime: 1000 * 60 * 5,
        enabled: !!assignmentId,
    })
}