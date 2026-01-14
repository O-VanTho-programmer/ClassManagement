import api from "../axios";

export async function fetchStudentListByAssignmentIdPublic(public_id:string) {
    try {
        const res = await api.get(`/public/student_list/by_assignment_id?public_id=${public_id}`);
        console.log('Fetch student list by assignment id response:', res);
        return res.data.studentList as StudentWithHomeworkPublic[];
    } catch (error) {
        console.error("Failed to fetch student list by assignment id:", error);
        return [];
    }
}