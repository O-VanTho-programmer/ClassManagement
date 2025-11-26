import api from "../axios";

export async function fetchStudentHomeworkById(student_homework_id: string): Promise<StudentWithHomework| null> {
    try {
        const res = await api.get(`/get_student_homework_by_id?studentHomeworkId=${student_homework_id}`);
        console.log('Fetch student homework by id response:', res);
        return res.data.studentHomework as StudentWithHomework;
    } catch (error) {
        console.error("Failed to fetch student homework by id:", error);
        return null;
    }
}