import api from "../axios";

export const addStudentIntoClassAPI = async (studentId: string, classId: string, enrollDate: string) => {
    try {
        if(!studentId || !classId || !enrollDate){
            console.error("Invalid input");
            throw new Error("Invalid input parameters");
        }

        const res = await api.post(`/add_student_into_class`, {studentId, classId, enrollDate});
        return res;
    } catch (error) {
        console.error("Failed to add student to class:", error);
        throw error;
    }
}