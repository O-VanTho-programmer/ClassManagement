import api from "../axios";

export async function fetchPublicIdForm(assignment_id:string): Promise<string | null>{
    try {
        const res = await api.get(`/public/get_public_id_form?assignment_id=${assignment_id}`);
        console.log('Fetch public id form response:', res);
        return res.data.publicIdForm;
    } catch (error) {
        console.error("Failed to fetch public id form:", error);
        return null;
    }
}