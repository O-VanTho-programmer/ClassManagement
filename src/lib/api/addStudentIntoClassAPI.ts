import api from "../axios";

export const addStudentIntoClassAPI = async (studentIds: string[], classId: string, enrollDate: string) => {
    if (!studentIds.length || !classId || !enrollDate) {
        console.error("Invalid input");
        throw new Error("Invalid input parameters");
    }

    const res = await api.post(`/add_student_into_class`, { studentIds, classId, enrollDate });
    return res;
}