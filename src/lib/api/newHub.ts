import { HubAddDto } from "@/types/Hub";
import api from "../axios";

export const newHubApi = async (newHubData: HubAddDto) => {
  try {
    const res = await api.post(`/new_hub`, newHubData);
    return res;
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return null;
  }
};
