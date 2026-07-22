import { fetchClassGradeWeights } from "@/lib/api/fetchClassGradeWeights";
import { useQuery } from "@tanstack/react-query";

export const useGetClassGradeWeights = (class_id: string, hub_id: string) => {
  return useQuery({
    queryKey: ["class_grade_weights", class_id, hub_id],
    queryFn: () => fetchClassGradeWeights(class_id, hub_id),
    staleTime: 1000 * 60 * 5,
    enabled: !!class_id && !!hub_id,
  });
};
