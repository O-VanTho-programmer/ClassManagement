import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import mammoth from "mammoth";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const hubId = formData.get("hubId") as string;

        // Check permission if hubId is provided
        if (hubId) {
            const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_HOMEWORK, hubId, { hubId });
            if (permissionCheck instanceof NextResponse) {
                return permissionCheck;
            }
        }

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        const isDocx = file.name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (!isDocx) {
            return NextResponse.json({ message: "Only .docx files are supported for HTML import" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Convert DOCX to HTML
        const result = await mammoth.convertToHtml({ buffer });
        const html = result.value;

        return NextResponse.json({ html }, { status: 200 });
    } catch (error: any) {
        console.error("Error parsing DOCX:", error);
        return NextResponse.json({ message: "AI processing/Word parsing failed", error: error.message }, { status: 500 });
    }
}
