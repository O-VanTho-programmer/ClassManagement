import { ClassData } from "@/types/ClassData";
import api from "../axios";

export const fetchClasses = async (hubId: string): Promise<ClassData[] | []> => {
  try {
    if (!hubId) {
      console.warn("No hubId provided — skipping fetchClasses");
      return [];
    }

    const res = await api.get(`/get_classes?hubId=${hubId}`);
    console.log('Fetch classes response:', res);
    return (res.data?.classData ?? []) as ClassData[]
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return [];
  }
};
