import api from "../axios";

export interface UpdateInvoiceStatusParams {
    classId: string;
    invoiceId: number;
    isPaid: boolean;
}

export const updateInvoiceStatus = async ({ classId, invoiceId, isPaid }: UpdateInvoiceStatusParams) => {
    const res = await api.patch("/update_invoice_status", { classId, invoiceId, isPaid });
    return res.data;
};
