import { fetchAssignmentSecuritySettings } from "@/lib/api/fetchAssignmentSecuritySettings";
import { useQuery } from "@tanstack/react-query";

export function useGetAssignmentSecuritySettings(assignment_id: string){
    return useQuery({
        queryKey: ["assignment_security_settings", assignment_id],
        queryFn: () => fetchAssignmentSecuritySettings(assignment_id),
        enabled: !!assignment_id,
    })
}