import api from "../axios";

export interface ClassGradeWeight {
  class_id: number;
  category: string;
  weight: number;
}

export interface FetchClassGradeWeightsResponse {
  message: string;
  data: ClassGradeWeight[];
}

export async function fetchClassGradeWeights(class_id: string, hub_id: string): Promise<ClassGradeWeight[]> {
  try {
    const res = await api.get<FetchClassGradeWeightsResponse>(
      `/get_class_grade_weights?hub_id=${hub_id}&class_id=${class_id}`
    );
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch class grade weights:", error);
    return [];
  }
}
