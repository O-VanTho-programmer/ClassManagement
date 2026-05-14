import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import mammoth from "mammoth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        const hubId = formData.get("hubId") as string;

        // Check permission
        if (hubId) {
            const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_HOMEWORK, hubId, { hubId });
            if (permissionCheck instanceof NextResponse) {
                return permissionCheck;
            }
        }

        if (!files || files.length === 0) {
            return NextResponse.json({ message: "No files uploaded" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp", 
        });

        const prompt = `
            You are an expert educator. Analyze the attached homework document(s) or images.
            Generate a comprehensive, detailed draft answer key for this homework.
            
            FORMATTING REQUIREMENTS:
            1. Return the output in HTML format suitable for display in a rich text editor (like ReactQuill).
            2. Use proper HTML tags: <h3> for section titles, <p> for text, <ol>/<ul> for lists, and <strong> for emphasis.
            3. Organize the answers clearly by question number.
            4. If multiple files are provided, combine them into a single coherent answer key.
            5. Provide clear explanations for complex answers.
            
            ONLY return the HTML content. Do not include markdown code blocks (e.g., \`\`\`html) or extra text.
        `;

        const parts: any[] = [prompt];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const mimeType = file.type;

            if (mimeType === "application/pdf" || mimeType.startsWith("image/")) {
                parts.push({
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: mimeType
                    }
                });
            } else if (
                mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.name.endsWith(".docx") || file.name.endsWith(".doc")
            ) {
                const result = await mammoth.extractRawText({ buffer });
                parts.push(`\n[Content from Word Document: ${file.name}]\n${result.value}\n`);
            } else {
                // Try to read as text for other types
                const text = buffer.toString("utf-8");
                parts.push(`\n[Content from File: ${file.name}]\n${text}\n`);
            }
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        let htmlContent = response.text();

        // Clean up any markdown artifacts if AI included them
        htmlContent = htmlContent.replace(/^```html\n?/, "").replace(/\n?```$/, "").trim();

        return NextResponse.json({ answerKey: htmlContent }, { status: 200 });

    } catch (error: any) {
        console.error("AI Answer Key Generation Error:", error);
        return NextResponse.json({ message: "AI processing failed", error: error.message }, { status: 500 });
    }
}
