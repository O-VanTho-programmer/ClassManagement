import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { content, hubId } = await req.json();

        // Check permission
        if (hubId) {
            const permissionCheck = await checkPermission(req, PERMISSIONS.CREATE_HOMEWORK, hubId, { hubId });
            if (permissionCheck instanceof NextResponse) {
                return permissionCheck;
            }
        }

        if (!content || !content.trim()) {
            return NextResponse.json({ message: "Homework content is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite", 
        });

        const prompt = `
            You are an expert educator. You are given the content of a homework assignment.
            Generate a comprehensive, detailed draft answer key for this homework.
            
            HOMEWORK CONTENT:
            ${content}
            
            FORMATTING REQUIREMENTS:
            1. Return the output in HTML format suitable for display in a rich text editor (like ReactQuill).
            2. Use proper HTML tags: <h3> for section/question titles, <p> for text, <ol>/<ul> for lists, and <strong> for emphasis.
            3. Organize the answers clearly by question number.
            4. Provide clear explanations or step-by-step solutions for complex questions.
            
            ONLY return the HTML content. Do not include markdown code blocks (e.g., \`\`\`html) or extra text.
        `;

        const result = await model.generateContent([prompt]);
        const response = await result.response;
        let htmlContent = response.text();

        // Clean up any markdown artifacts if AI included them
        htmlContent = htmlContent.replace(/^```html\n?/, "").replace(/\n?```$/, "").trim();

        return NextResponse.json({ answerKey: htmlContent }, { status: 200 });

    } catch (error: any) {
        console.error("AI Answer Key From Content Generation Error:", error);
        return NextResponse.json({ message: "AI processing failed", error: error.message }, { status: 500 });
    }
}
