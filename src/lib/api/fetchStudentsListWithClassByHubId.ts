import api from "../axios";

export const fetchStudentsListWithClassByHubId = async (
    hub_id: string, 
    offset: number = 0, limit: number = 1000, 
    debouncedSearch: string = "", 
    status: string = "All",
    classId: string = "All"
): Promise<StudentWithClasses[]> => {
    try {
        if (!hub_id) {
            console.warn("No classId provided — skipping fetchAllStudentListByHubId");
            return [];
        }

        let url = `/get_student_list_with_class_by_hub_id?hubId=${hub_id}&offset=${offset}&limit=${limit}`;

        if (debouncedSearch) {
            url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }

        if (status !== "All") {
            url += `&status=${encodeURIComponent(status)}`;
        }

        if (classId !== "All") {
            url += `&classId=${encodeURIComponent(classId)}`;
        }

        console.log("Fetching list student by hubId:", url);


        const res = await api.get(url);

        return res.data.studentList as StudentWithClasses[];
    } catch (error) {
        console.error("Failed to fetch list student by hubId:", error);
        return [];
    }
}