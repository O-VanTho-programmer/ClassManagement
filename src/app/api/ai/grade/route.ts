import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const gradingSchema: Schema = {
    description: "Grading result",
    type: SchemaType.OBJECT,
    properties: {
        grade: { type: SchemaType.NUMBER, description: "A score from 0 to 100", nullable: false },
        feedback: { type: SchemaType.STRING, description: "Constructive feedback.", nullable: false },
        correct_count: { type: SchemaType.NUMBER },
        total_questions: { type: SchemaType.NUMBER },
    },
    required: ["grade", "feedback"],
};

export async function POST(req: Request) {
    try {
        // CHANGED: Expect 'images' as an array of strings
        const { answerKey, images } = await req.json();

        if (!answerKey || !images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ message: "Missing data or invalid image format" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-preview-09-2025",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: gradingSchema,
            },
        });

        const promptText = `
      You are a strict but fair teaching assistant.
      
      TASK:
      1. Analyze the attached images (these are multiple pages of ONE student's homework).
      2. Compare all pages strictly against the provided ANSWER KEY below.
      3. Detect if the student's answer is correct, incorrect, or partially correct.
      4. Calculate a grade from 0 to 100 based on the number of correct answers vs total questions.
      
      --- ANSWER KEY START ---
      ${answerKey}
      --- ANSWER KEY END ---
      
      Provide the output in JSON format.
    `;

        const imageParts = await Promise.all(
            images.map(async (img: { url: string }) => {
                try {
                    const response = await fetch(img.url);
                    if (!response.ok) throw new Error(`Failed to fetch image: ${img.url}`);

                    const arrayBuffer = await response.arrayBuffer();
                    const base64Data = Buffer.from(arrayBuffer).toString("base64");

                    return {
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/jpeg", // Cloudinary auto-format is usually jpg or webp, both supported
                        },
                    };
                } catch (fetchError) {
                    console.error(`Error fetching image ${img.url}:`, fetchError);
                    return null;
                }
            })
        );

        const validImageParts = imageParts.filter((part) => part !== null);

        if (validImageParts.length === 0) {
            return NextResponse.json({ message: "No valid images provided" }, { status: 400 });
        }

        // Pass text prompt AND all image parts
        const result = await model.generateContent([promptText, ...validImageParts]);
        const response = await result.response;
        const jsonResponse = JSON.parse(response.text());

        return NextResponse.json({ message: "Success", ...jsonResponse }, { status: 200 });

    } catch (error: any) {
        console.error("AI Grading Error:", error);
        return NextResponse.json({ message: "AI processing failed", error: error.message }, { status: 500 });
    }
}