import api from "../axios";

export const fetchClassHomeworkById = async (assignmentId: string): Promise<ClassHomeworkWithClassName | null> => {
  try {
    if (!assignmentId) {
      console.warn("No assignmentId provided — skipping fetchClassHomeworkById");
      return null;
    }

    const res = await api.get(`/get_class_homework_by_id?assignmentId=${assignmentId}`);
    console.log('Fetch assignment response:', res);
    return (res.data?.class_homework ?? null) as ClassHomeworkWithClassName;
  } catch (error) {
    console.error("Failed to fetch assignment:", error);
    return null;
  }
};
