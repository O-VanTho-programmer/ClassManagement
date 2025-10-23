import api from "../axios";

export const fetchAllStudentListByHubId = async (hub_id: string): Promise<Student[] | null>=> {
    try{
        if (!hub_id) {
            console.warn("No classId provided — skipping fetchAllStudentListByHubId");
            return null;
        }

        const res = await api.get(`/get_all_student_list_by_hub_id?hubId=${hub_id}`);

        return res.data.studentList as Student[];
    }catch(error){
        console.error("Failed to fetch list student by hubId:", error);
        return null;
    }
}