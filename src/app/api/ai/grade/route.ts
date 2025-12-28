import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const gradingSchema: Schema = {
    description: "Grading result with detailed breakdown per question",
    type: SchemaType.OBJECT,
    properties: {
        grade: {
            type: SchemaType.NUMBER,
            description: "Overall calculated score (0-100)",
            nullable: false
        },
        feedback: {
            type: SchemaType.STRING,
            description: "Overall constructive feedback summary.",
            nullable: false
        },

        questions: {
            type: SchemaType.ARRAY,
            description: "List of grades for each specific question found in the answer key",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question_number: {
                        type: SchemaType.NUMBER,
                        description: "The number of the question (e.g., 1, 2, 3)"
                    },
                    grade: {
                        type: SchemaType.NUMBER,
                        description: "Points earned for this specific question (e.g., 8.5)"
                    },
                    max_grade: {
                        type: SchemaType.NUMBER,
                        description: "Maximum possible points for this specific question"
                    },
                    feed_back: {
                        type: SchemaType.STRING,
                        description: "Feedback for this specific question"
                    }
                },
                required: ["question_number", "grade", "max_grade"],
            },
        },
    },
    required: ["grade", "feedback", "questions"],
};

export async function POST(req: Request) {
    try {
        // CHANGED: Expect 'images' as an array of strings
        const { answerKey, images, hubId } = await req.json();
        
        // Check permission - need GRADE_HOMEWORK to use AI grading
        if (hubId) {
            const permissionCheck = await checkPermission(req, PERMISSIONS.GRADE_HOMEWORK, hubId, { hubId });
            if (permissionCheck instanceof NextResponse) {
                return permissionCheck;
            }
        }

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
            1. Analyze the attached student homework images.
            2. Compare them against the Answer Key below.
            3. For EACH question defined in the answer key:
                - Determine if the answer is correct.
                - Assign a specific score (decimal allowed, e.g. 8.5) based on correctness.
                - Identify the max points for that question.
                - Give feedback for that answer.
            4. Calculate the total grade (0-100 scale).
            
            --- ANSWER KEY ---
            ${answerKey}
            --- END KEY ---
            
            Provide the output in JSON format with a 'questions' array containing 'question_number', 'grade', and 'max_grade'.
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

        const result = await model.generateContent([promptText, ...validImageParts]);
        const response = await result.response;
        const jsonResponse = JSON.parse(response.text());

        const safeResponse = {
            ...jsonResponse,
            questions: Array.isArray(jsonResponse.questions) ? jsonResponse.questions : []
        };

        return NextResponse.json({ message: "Success", ...safeResponse }, { status: 200 });

    } catch (error: any) {
        console.error("AI Grading Error:", error);
        return NextResponse.json({ message: "AI processing failed", error: error.message }, { status: 500 });
    }
}