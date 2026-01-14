import { fetchPublicIdForm } from "@/lib/api/fetchPublicIdForm";
import { useQuery } from "@tanstack/react-query";

export function useGetPublicIdForm(assignment_id: string) {
    return useQuery({
        queryKey: ['get_public_id_form', assignment_id],
        queryFn: () => fetchPublicIdForm(assignment_id),
        enabled: !!assignment_id,
    })
}