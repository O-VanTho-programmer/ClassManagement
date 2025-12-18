import api from "../axios";

export async function removeStudentFromClass(studentId: string, classId: string) {
    try {
        const res = await api.delete(`/remove_student_from_class`, { data: { studentId, classId } });
        console.log('Delete student from class response:', res);
        return res;
    } catch (error) {
        console.error("Failed to delete homework:", error);
        throw error;
    }
}