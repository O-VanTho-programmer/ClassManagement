import api from "../axios";

export const fetchTeachersWorkload = async (hubId: string): Promise<TeacherWorkload[] | []> => {
  try {
    if (!hubId) {
      console.warn("No classId provided — skipping fetchTeachersWorkload");
      return [];
    }

    const res = await api.get(`/get_teachers_workload?hubId=${hubId}`);
    console.log('Fetch classes response:', res);
    return (res.data?.teachWorkloads ?? []) as TeacherWorkload[]
  } catch (error) {
    console.error("Failed to fetch student list:", error);
    return [];
  }
};
