import { useAlert } from "@/components/AlertProvider/AlertContext";
import { updateAssignmentSecurity } from "@/lib/api/updateAssignmentSecurity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useMutationToggleFaceAuth = (assignment_id: string) => {
    const queryClient = useQueryClient();
    const {showAlert} = useAlert();
    const {hub_id} = useParams();

    return useMutation({
        mutationFn: (enabled: boolean) => updateAssignmentSecurity(assignment_id, hub_id as string, enabled),
        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey: ['assignment_security_settings', assignment_id] });
            const previousSettings = queryClient.getQueryData(['assignment_security_settings', assignment_id]);
            queryClient.setQueryData(['assignment_security_settings', assignment_id], (old: any) => {
                if (!old) return null;
                return { ...old, is_face_auth_enabled: newValue };
            });
            return { previousSettings };
        },
        onError: (err, newValue, context: any) => {
            queryClient.setQueryData(['assignment_security_settings', assignment_id], context.previousSettings);
            showAlert("Failed to update security settings.", 'error');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['assignment_security_settings', assignment_id] });
        }
    });
}