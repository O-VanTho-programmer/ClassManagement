import { fetchClassInvoices } from "@/lib/api/fetchClassInvoices";
import { useQuery } from "@tanstack/react-query";

export function useGetClassInvoices(classId: string) {
    return useQuery({
        queryKey: ['class_invoices', classId],
        queryFn: () => fetchClassInvoices(classId),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        enabled: !!classId,
    });
}
