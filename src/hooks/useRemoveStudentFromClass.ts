import { useAlert } from "@/components/AlertProvider/AlertContext";
import { removeStudentFromClass } from "@/lib/api/removeStudentFromClass";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveStudentFromClass = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: async ({ studentId, classId }: { studentId: string, classId: string }) => {
            return await removeStudentFromClass(studentId, classId);
        },
        onSuccess: (_data, variables) => {
            showAlert("Student removed from class", "success");
            queryClient.invalidateQueries({ queryKey: ["get_student_list_by_class_id", variables.classId] });
        },
        onError: (error) => {
            showAlert(error.message, "error");
        }
    });

    const handleRemoveStudentFromClass = async (studentId: string, classId: string) => {
        return await mutation.mutateAsync({ studentId, classId });
    };

    return { 
        isRemoving: mutation.isPending, 
        handleRemoveStudentFromClass 
    };
};