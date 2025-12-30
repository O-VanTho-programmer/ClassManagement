import api from "@/lib/axios";

export async function logout() {
    try {
        const res = await api.post(`/auth/logout`);
        return res;
    } catch (error) {
        console.error("Failed to logout:", error);
        throw error;
    }
}