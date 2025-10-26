import { fetchAttendanceRecords } from "@/lib/api/fetchAttendanceRecords"
import { useQuery } from "@tanstack/react-query"

export const useGetAttendanceRecordsQuery = (class_id: string) => {
    return useQuery({
        queryKey: ["studentAttendance", class_id],
        queryFn: () => fetchAttendanceRecords(class_id),
        staleTime: 1000 * 60 * 5,
        enabled: !!class_id,
    })
}