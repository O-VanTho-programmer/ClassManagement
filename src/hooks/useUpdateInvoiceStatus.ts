import { useAlert } from "@/components/AlertProvider/AlertContext";
import { updateInvoiceStatus, UpdateInvoiceStatusParams } from "@/lib/api/updateInvoiceStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (params: UpdateInvoiceStatusParams) => updateInvoiceStatus(params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["class_invoices", variables.classId] });
      showAlert("Tuition payment status updated successfully.", "success");
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message;
      showAlert(`Error updating payment status: ${errMsg}`, "error");
    }
  });
}
