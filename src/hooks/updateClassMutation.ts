import { updateClassInfo } from "@/lib/api/updateClassInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassData } from "@/types/ClassData";
import { useAlert } from "@/components/AlertProvider/AlertContext";

export function useUpdateClassMutation(hub_id: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: ({ updatedClass }: { updatedClass: ClassData }) => 
            updateClassInfo(updatedClass, hub_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userClasses', hub_id] });
            showAlert('Class updated successfully.', 'success');
            onSuccessCallback?.();
        },
        onError: (error: Error) => {
            showAlert(`Error: ${error.message}`, 'error');
        }
    });
}