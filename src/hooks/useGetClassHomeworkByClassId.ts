import { fetchClassHomeworkListByClassId } from "@/lib/api/fetchClassHomeworkListByClassId";
import { useQuery } from "@tanstack/react-query";

export function useGetClassHomeworkByClassId (classId: string) {
    return useQuery({
        queryKey: ['homework_by_class_id', classId],
        queryFn: () => fetchClassHomeworkListByClassId(classId),
        staleTime: 1000 * 60 * 5,
        enabled: !!classId,
    })
}