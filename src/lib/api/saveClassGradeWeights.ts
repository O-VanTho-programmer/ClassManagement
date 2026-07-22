import api from "../axios";

export interface SaveClassGradeWeightsPayload {
  hubId: string;
  classId: string;
  weights: { category: string; weight: number }[];
}

export async function saveClassGradeWeights(payload: SaveClassGradeWeightsPayload) {
  try {
    const res = await api.post(`/save_class_grade_weights`, payload);
    return res.data;
  } catch (error) {
    console.error("Failed to save class grade weights:", error);
    throw error;
  }
}
