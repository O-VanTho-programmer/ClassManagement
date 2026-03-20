import { useAlert } from "@/components/AlertProvider/AlertContext";
import { deleteClass } from "@/lib/api/deleteClass";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteClassMutation(hub_id: string) {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();


    return useMutation({
        mutationFn: ({ class_id, hub_id }: { class_id: string, hub_id: string }) => deleteClass(class_id, hub_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userClasses', hub_id] });
            showAlert('Class deleted successfully.', 'success');
        },
        onError: (error: Error) => {
            showAlert(`Error: ${error.message}`, 'error');
        }
    });

}