import { Hub } from "@/types/Hub";
import api from "../axios";

export const fetchHubs = async (userId?: string): Promise<Hub[] | null> => {
  try {
    if (!userId) {
      console.warn("No userId provided — skipping fetchHubs");
      return null;
    }

    const res = await api.get(`/get_hubs?userId=${userId}`);
    console.log('Fetch hubs response:', res);
    return res.data.hubs as Hub[];
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return [] as Hub[];
  }
};
