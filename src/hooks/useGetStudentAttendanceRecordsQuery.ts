import { fetchStudentAttendanceRecords } from "@/lib/api/fetchStudentAttendanceRecords"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentAttendanceRecordsQuery = (class_id: string) => {
    return useQuery({
        queryKey: ["attendance", class_id],
        queryFn: () => fetchStudentAttendanceRecords(class_id),
        staleTime: 1000 * 60 * 5,
        enabled: !!class_id,
    })
}