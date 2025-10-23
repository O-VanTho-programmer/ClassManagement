import api from "../axios";

export const addStudentIntoClassAPI = async (studentId: string, classId: string) => {
    try {
        if(!studentId || !classId){
            console.error("Invalid input");
            return;
        }

        const res = await api.post(`/add_student_into_class`, {studentId, classId});
        return res;
    } catch (error) {
        console.error("Failed to fetch hubs:", error);
        return null;
    }
}