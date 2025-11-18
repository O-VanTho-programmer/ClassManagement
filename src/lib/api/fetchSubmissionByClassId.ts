import api from "../axios";

export const fetchSubmissionByClassId = async (classId: string) => {
  try {
    if (!classId) {
      console.warn("No classId provided — skipping fetchStudentListByClassId");
      return [];
    }

    const res = await api.get(`/get_homework_submission_by_class_id?classId=${classId}`);
    console.log('Fetch submission by class id response:', res);
    return (res.data?.studentList ?? [])
  } catch (error) {
    console.error("Failed to fetch submissions by class id:", error);
    return [];
  }
};
