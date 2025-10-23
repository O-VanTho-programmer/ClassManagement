import { ClassData } from "@/types/ClassData";
import api from "../axios";

export const fetchClassById = async (classId: string): Promise<ClassData | null> => {
  try {
    if (!classId) {
      console.warn("No classId provided — skipping fetch Class by Id");
      return null;
    }

    const res = await api.get(`/get_class_by_id?classId=${classId}`);
    console.log('Fetch classes response:', res);
    return (res.data?.classData ?? null) as ClassData;
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return null;
  }
};