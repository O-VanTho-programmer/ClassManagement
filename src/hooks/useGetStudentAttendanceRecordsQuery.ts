import { fetchStudentAttendanceRecords } from "@/lib/api/fetchStudentAttendanceRecords"
import { Schedule } from "@/types/Schedule"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentAttendanceRecordsQuery = (class_id: string, schedule: Schedule[]) => {
    return useQuery({
        queryKey: ["studentAttendanceRecords", class_id],
        queryFn: () => fetchStudentAttendanceRecords(class_id, schedule),
        staleTime: 1000 * 60 * 5,
        enabled: !!class_id,
    })
}