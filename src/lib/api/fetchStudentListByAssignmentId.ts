import api from "../axios";

export async function fetchStudentListByAssignmentId(assignmentId:string) {
    try {
        const res = await api.get(`/get_student_by_assignment_id?assignmentId=${assignmentId}`);
        console.log('Fetch student list by assignment id response:', res);
        return res.data.studentList as StudentWithHomework[];
    } catch (error) {
        console.error("Failed to fetch student list by assignment id:", error);
        return [];
    }
}