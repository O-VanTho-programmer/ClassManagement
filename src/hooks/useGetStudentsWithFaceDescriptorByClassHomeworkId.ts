import { fetchStudentsWithFaceDescriptorByClassHomeworkId } from "@/lib/api/fetchStudentsWithFaceDescriptorByClassHomeworkId";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentsWithFaceDescriptorByClassHomeworkId(class_homework_id: string) {
    return useQuery({
        queryKey: ['students_with_face_descriptor', class_homework_id],
        queryFn: () => fetchStudentsWithFaceDescriptorByClassHomeworkId(class_homework_id),
        staleTime: 1000 * 60 * 5,
    })
}