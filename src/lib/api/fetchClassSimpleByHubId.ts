import { ClassDataSimple } from "@/types/ClassData";
import api from "../axios";

export const fetchClassSimpleByHubId = async (hubId: string): Promise<ClassDataSimple[] | []> => {
  try {
    if (!hubId) {
      console.warn("No hubId provided — skipping fetchClasses");
      return [];
    }

    const res = await api.get(`/get_classes/simple?hubId=${hubId}`);
    console.log('Fetch classes response:', res);
    return (res.data?.classData ?? []) as ClassDataSimple[]
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return [];
  }
};
