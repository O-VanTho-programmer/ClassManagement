import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const gradingSchema: Schema = {
    description: "Grading result with detailed breakdown per question, including image readability assessment",
    type: SchemaType.OBJECT,
    properties: {
        is_readable: {
            type: SchemaType.BOOLEAN,
            description: "Whether the submission image(s) are clear enough to grade accurately. Set to false if the image is blurry, too dark, illegible, or handwriting is impossible to read.",
            nullable: false
        },
        confidence_score: {
            type: SchemaType.NUMBER,
            description: "Your confidence level (0-100) in the grading result. 0 means completely unreadable, 100 means perfectly clear. If is_readable is false, this should be below 40.",
            nullable: false
        },
        grade: {
            type: SchemaType.NUMBER,
            description: "Overall calculated score (0-100). Set to 0 if is_readable is false.",
            nullable: false
        },
        feedback: {
            type: SchemaType.STRING,
            description: "Overall constructive feedback summary. If is_readable is false, explain why the image cannot be graded.",
            nullable: false
        },
        questions: {
            type: SchemaType.ARRAY,
            description: "List of grades for each specific question found in the answer key. Return empty array if is_readable is false.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question_number: {
                        type: SchemaType.NUMBER,
                        description: "The number of the question (e.g., 1, 2, 3)"
                    },
                    grade: {
                        type: SchemaType.NUMBER,
                        description: "Points earned for this specific question (e.g., 85)"
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
    required: ["is_readable", "confidence_score", "grade", "feedback", "questions"],
};

export async function POST(req: Request) {
    try {
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
            model: "gemini-3.1-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: gradingSchema,
            },
        });

        const promptText = `
            You are a strict but fair teaching assistant grading student homework.

            CRITICAL FIRST STEP — IMAGE READABILITY CHECK:
            Before grading, assess the quality of the submitted image(s):
            - If the image is blurry, too dark, overexposed, or the handwriting is impossible to read → set is_readable: false, confidence_score below 40, grade: 0, questions: [], and explain in feedback why it cannot be graded.
            - NEVER fabricate or guess answers when you cannot clearly read the student's work. It is better to flag the submission for manual review than to invent a grade.
            - If the image is legible, proceed with grading normally and set is_readable: true.

            GRADING TASK (only if is_readable is true):
            1. Analyze the attached student homework images.
            2. Compare them against the Answer Key below.
            3. Ensure the TOTAL grade is calculated on a scale of exactly 100 points (total max score = 100).
            4. CRITICAL GRADING RULE: EVERY sub-question must be counted as a separate, distinct question.
               For example, if the Answer Key has "Ex1: 1) ... 2) ...", you must break this down into separate array entries:
               - Q1: for "Ex1: 1)" with its own grade and max_grade
               - Q2: for "Ex1: 2)" with its own grade and max_grade
               Distribute the 100 total points evenly or proportionally among ALL sub-questions.
            5. Provide a detailed breakdown in the 'questions' array.
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
                    const buffer = Buffer.from(arrayBuffer);

                    const urlLower = img.url.toLowerCase();
                    if (urlLower.includes(".pdf") || urlLower.includes("/pdf")) {
                        return {
                            inlineData: {
                                data: buffer.toString("base64"),
                                mimeType: "application/pdf",
                            },
                        };
                    } else if (urlLower.includes(".docx") || urlLower.includes("/raw")) {
                        const mammothResult = await mammoth.extractRawText({ buffer });
                        return {
                            text: `\n\n[Content of Student Document ${img.url}]:\n${mammothResult.value}\n`
                        };
                    } else {
                        return {
                            inlineData: {
                                data: buffer.toString("base64"),
                                mimeType: "image/jpeg",
                            },
                        };
                    }
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