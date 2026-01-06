import api from "../axios";

export async function fetchClassHomeworkByIdPublic (assignmentId: string): Promise<ClassHomeworkWithClassName | null> {
    try {
      if (!assignmentId) {
        console.warn("No assignmentId provided — skipping fetchClassHomeworkById");
        return null;
      }
  
      const res = await api.get(`/public/class_homework/?assignmentId=${assignmentId}`);
      console.log('Fetch assignment response:', res);
      return (res.data?.class_homework ?? null) as ClassHomeworkWithClassName;
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      return null;
    }
} 