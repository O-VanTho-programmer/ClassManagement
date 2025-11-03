import { fetchHomeworkListAPI } from "@/lib/api/fetchHomeworkListAPI";
import { useQuery } from "@tanstack/react-query";

export function useGetHomeworkListQuery(hubId:string) {
    return useQuery({
        queryKey: ['homeworkList', hubId],
        queryFn: () => fetchHomeworkListAPI(hubId),
        staleTime: 1000 * 60 * 5,
        enabled: !!hubId,
    })
}