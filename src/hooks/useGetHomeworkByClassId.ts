import { fetchHomeworkListByClassId } from "@/lib/api/fetchHomeworkListByClassId";
import { useQuery } from "@tanstack/react-query";

export function useGetHomeworkByClassId (classId: string) {
    return useQuery({
        queryKey: ['homework_by_class_id', classId],
        queryFn: () => fetchHomeworkListByClassId(classId),
        staleTime: 1000 * 60 * 5,
        enabled: !!classId,
    })
}