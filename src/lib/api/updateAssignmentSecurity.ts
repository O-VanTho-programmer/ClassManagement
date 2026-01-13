import api from "../axios"

export const updateAssignmentSecurity = async (assignment_id: string, enabled: boolean) => {
    try {
        const res = await api.put(`/update_assignment_security`, { assignment_id, enabled });
        return res;
    } catch (error) {
        console.error("Failed to update assignment security:", error);
        throw error;
    }
}