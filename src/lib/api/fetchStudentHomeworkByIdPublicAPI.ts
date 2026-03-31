import api from "../axios";

export async function fetchStudentHomeworkByIdPublic(student_homework_id: string): Promise<StudentWithHomework | null> {
    try {
        const res = await api.get(`public/get_student_homework_by_id?studentHomeworkId=${student_homework_id}`);
        console.log('Fetch student homework by id public response:', res);
        return res.data.studentHomework as StudentWithHomework;
    } catch (error) {
        console.error("Failed to fetch student homework by id public:", error);
        return null;
    }
}
