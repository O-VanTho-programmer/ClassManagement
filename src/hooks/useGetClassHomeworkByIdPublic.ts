import { fetchClassHomeworkByIdPublic } from "@/lib/api/fetchClassHomeworkByIdPublic";
import { useQuery } from "@tanstack/react-query";

export function useGetClassHomeworkByIdPublic(public_id: string) {
    return useQuery({
        queryKey: ['get_class_homework_by_id_public', public_id],
        queryFn: () => fetchClassHomeworkByIdPublic(public_id),
        staleTime: 1000 * 60 * 5,
        enabled: !!public_id,
    })
}