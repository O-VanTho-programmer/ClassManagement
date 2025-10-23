import api from "../axios";

export const fetchStudentListByClassId = async (classId: string): Promise<Student[] | []> => {
  try {
    if (!classId) {
      console.warn("No classId provided — skipping fetchStudentListByClassId");
      return [];
    }

    const res = await api.get(`/get_student_list_by_class_id?classId=${classId}`);
    console.log('Fetch classes response:', res);
    return (res.data?.studentList ?? []) as Student[]
  } catch (error) {
    console.error("Failed to fetch student list:", error);
    return [];
  }
};
