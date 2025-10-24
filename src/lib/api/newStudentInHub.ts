import api from "../axios";

export const newStudentInHub = async (newStudentForm: StudentInputDto, hub_id: string) => {
  try {
    const res = await api.post(`/new_student_in_hub`, {newStudentForm, hubId: hub_id});
    console.log('Create student response:', res);
    return res.data.newStudentId;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw error;
  }
};
