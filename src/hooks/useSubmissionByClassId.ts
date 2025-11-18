import { fetchSubmissionByClassId } from "@/lib/api/fetchSubmissionByClassId";
import { useQuery } from "@tanstack/react-query";

export function useGetSubmissionByClassId(classId:string) {
    return useQuery({
        queryKey: ['submissionByClassId', classId],
        queryFn: () => fetchSubmissionByClassId(classId),
        enabled: !!classId,
    })
}