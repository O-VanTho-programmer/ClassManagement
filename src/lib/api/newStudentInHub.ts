import api from "../axios";

export const newStudentInHub = async (newStudentForm: StudentInputDto, hub_id: string) => {
  try {
    const res = await api.post(`/new_student_in_hub`, {newStudentForm, hub_id});
    console.log('Fetch classes response:', res);
    return res.data.newStudentId;
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return null;
  }
};
