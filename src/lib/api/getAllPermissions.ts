import api from "../axios";

export async function getAllPermissions(): Promise<Permission[]> {
    try {
        const res = await api.get("/get_permissions");
        return res.data.permissions as Permission[];
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
    }
}