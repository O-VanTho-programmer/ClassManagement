import { fetchClassHomeworkByHomeworkId } from "@/lib/api/fetchClassHomeworkByHomeworkId";
import { useQuery } from "@tanstack/react-query";

export function useGetClassHomeworkByHomeworkId(homeworkId: string) {
    return useQuery({
        queryKey: ['get_class_homework_by_homework_id', homeworkId],
        queryFn: () => fetchClassHomeworkByHomeworkId(homeworkId),
        staleTime: 1000 * 60 * 5,
        enabled: !!homeworkId,
    });
}