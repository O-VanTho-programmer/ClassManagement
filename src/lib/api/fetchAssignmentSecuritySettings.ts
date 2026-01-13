import api from "../axios";

export const fetchAssignmentSecuritySettings = async (assignment_id: string): Promise<ClassHomeworkWithSecuritySettings | null>=> {
    try{
        if (!assignment_id) {
            console.warn("No assignment_id provided — skipping fetchAssignmentSecuritySettings");
            return null;
        }

        const res = await api.get(`/get_assignment_security_settings?assignment_id=${assignment_id}`);

        return res.data.classHomework as ClassHomeworkWithSecuritySettings;
    }catch(error){
        console.error("Failed to fetch assignment security settings by assignment_id:", error);
        return null;
    }
}