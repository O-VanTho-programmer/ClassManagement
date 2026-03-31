import { fetchStudentHomeworkByIdPublic } from "@/lib/api/fetchStudentHomeworkByIdPublicAPI";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentHomeworkByIdPublicQuery(student_homework_id:string){
    return useQuery({
        queryKey: ["public_get_student_homework_by_id", student_homework_id],
        queryFn: () => fetchStudentHomeworkByIdPublic(student_homework_id),
        staleTime: 0,
        enabled: !!student_homework_id 
    })
}
