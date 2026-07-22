import { useAlert } from "@/components/AlertProvider/AlertContext";
import { saveClassGradeWeights, SaveClassGradeWeightsPayload } from "@/lib/api/saveClassGradeWeights";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSaveClassGradeWeightsMutation(hub_id: string) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (payload: SaveClassGradeWeightsPayload) => saveClassGradeWeights(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["class_grade_weights", variables.classId, hub_id] });
      showAlert("Class grade weights saved successfully.", "success");
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message;
      showAlert(`Error saving weights: ${errMsg}`, "error");
    }
  });
}
