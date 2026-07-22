import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS, getHubIdFromClassId } from "@/lib/permissions";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, isPaid, classId } = body;

        if (invoiceId === undefined || isPaid === undefined || !classId) {
            return NextResponse.json({ message: "Bad Request: invoiceId, isPaid, and classId are required" }, { status: 400 });
        }

        const hubId = await getHubIdFromClassId(classId);
        if (!hubId) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_STUDENT, hubId, body);
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        const queryUpdateInvoice = `
            UPDATE invoice 
            SET IsPaid = ?, UpdatedDate = NOW() 
            WHERE InvoiceId = ? AND ClassId = ?
        `;

        await pool.query(queryUpdateInvoice, [isPaid ? 1 : 0, invoiceId, classId]);

        return NextResponse.json({ message: "Success", invoiceId, isPaid }, { status: 200 });
    } catch (error) {
        console.error("Error updating invoice status:", error);
        return NextResponse.json({ message: "Error updating invoice status" }, { status: 500 });
    }
}
