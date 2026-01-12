import api from "../axios";

export const fetchStudentsWithFaceDescriptorByClassHomeworkId = async (classHomeworkId: string):Promise<StudentWithFaceDescriptor[] | []>=> {
  try {
    if (!classHomeworkId) {
      console.warn("No classHomeworkId provided — skipping fetchStudentsWithFaceDescriptorByClassHomeworkId");
      return [];
    }

    const res = await api.get(`/face_recognition/get_student?class_homework_id=${classHomeworkId}`);
    console.log('Fetch students by classHomeworkId response:', res);
    return (res.data?.studentList ?? [])
  } catch (error) {
    console.error("Failed to fetch students by classHomeworkId:", error);
    return [];
  }
};
