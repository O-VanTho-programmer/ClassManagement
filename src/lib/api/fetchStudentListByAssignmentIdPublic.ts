import api from "../axios";

export async function fetchStudentListByAssignmentIdPublic(assignmentId:string) {
    try {
        const res = await api.get(`/public/student_list/by_assignment_id?assignmentId=${assignmentId}`);
        console.log('Fetch student list by assignment id response:', res);
        return res.data.studentList as StudentWithHomeworkPublic[];
    } catch (error) {
        console.error("Failed to fetch student list by assignment id:", error);
        return [];
    }
}