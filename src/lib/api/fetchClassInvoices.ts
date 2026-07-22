import api from "../axios";

export interface Invoice {
    invoice_id: number;
    student_id: number;
    student_name: string;
    is_paid: number;
    version: number;
    amount: number;
    due_date: string;
    created_date: string;
}

export const fetchClassInvoices = async (classId: string): Promise<Invoice[]> => {
    try {
        if (!classId) {
            return [];
        }
        const res = await api.get(`/get_class_invoices?classId=${classId}`);
        return res.data?.invoices ?? [];
    } catch (error) {
        console.error("Failed to fetch class invoices:", error);
        return [];
    }
};
