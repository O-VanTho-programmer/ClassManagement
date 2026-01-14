import api from "../axios";

export async function fetchClassHomeworkByIdPublic (public_id: string): Promise<ClassHomeworkWithClassName | null> {
    try {
      if (!public_id) {
        console.warn("No public_id provided — skipping fetchClassHomeworkById");
        return null;
      }
  
      const res = await api.get(`/public/class_homework/?public_id=${public_id}`);
      console.log('Fetch assignment response:', res);
      return (res.data?.class_homework ?? null) as ClassHomeworkWithClassName;
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
      return null;
    }
} 