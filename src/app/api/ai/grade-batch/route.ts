import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const studentResultSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        student_homework_id: {
            type: SchemaType.STRING,
            description: "The unique ID of the student homework submission provided in the prompt header"
        },
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
            description: "Total score (0-100). Set to 0 if is_readable is false."
        },
        feedback: {
            type: SchemaType.STRING,
            description: "Overall constructive feedback. If is_readable is false, explain why the image cannot be graded."
        },
        questions: {
            type: SchemaType.ARRAY,
            description: "Return empty array if is_readable is false.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question_number: { type: SchemaType.NUMBER },
                    grade: { type: SchemaType.NUMBER },
                    max_grade: { type: SchemaType.NUMBER },
                    comment: { type: SchemaType.STRING }
                },
                required: ["question_number", "grade", "max_grade"]
            }
        }
    },
    required: ["student_homework_id", "is_readable", "confidence_score", "grade", "feedback", "questions"]
};

const batchGradingSchema: Schema = {
    type: SchemaType.ARRAY,
    items: studentResultSchema
};

export async function POST(req: Request) {
    try {
        const { answerKey, submissions } = await req.json();

        if (!answerKey || !submissions || !Array.isArray(submissions) || submissions.length === 0) {
            return NextResponse.json({ message: "Invalid input. 'submissions' must be a non-empty array." }, { status: 400 });
        }

        // Use the preview model which supports JSON schema well
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: batchGradingSchema,
                temperature: 0, // Zero temperature for consistent grading
            },
        });

        const systemInstructions = `
            You are a strict but fair teaching assistant grading multiple student submissions.

            CRITICAL RULE — IMAGE READABILITY:
            For EACH student submission, FIRST assess whether the image(s) are readable:
            - If the image is blurry, too dark, overexposed, or the handwriting is impossible to read → set is_readable: false, confidence_score below 40, grade: 0, questions: [], and explain in feedback.
            - NEVER fabricate or guess answers when you cannot clearly read the student's work. Flag it for manual review instead.
            - Only grade (is_readable: true) when you can clearly read the submission.
            
            TASK:
            1. I will provide an Answer Key.
            2. I will provide submissions for multiple students. Each submission is marked with a "Student Homework ID".
            3. For EACH student:
               - Assess image readability first (see CRITICAL RULE above).
               - If readable: analyze their images against the Answer Key, calculate the total grade (0-100), provide a breakdown for each question.
               - IMPORTANT: Return the "student_homework_id" exactly as it appears in the prompt so I can match the grade to the correct student.
            
            --- ANSWER KEY START ---
            ${answerKey}
            --- ANSWER KEY END ---
        `;

        const parts: any[] = [{ text: systemInstructions }];

        for (const sub of submissions) {
            if (!sub.submission_urls || sub.submission_urls.length === 0) continue;

            parts.push({
                text: `\n\n=== BEGIN SUBMISSION FOR STUDENT HOMEWORK ID: ${sub.student_homework_id} ===\nAnalyze the following images for this student:`
            });

            // Fetch and attach images for this student
            for (const img of sub.submission_urls) {
                try {
                    const response = await fetch(img.url);
                    if (!response.ok) {
                        console.error(`Failed to fetch image: ${img.url}`);
                        continue;
                    }
                    const arrayBuffer = await response.arrayBuffer();
                    const base64Data = Buffer.from(arrayBuffer).toString("base64");

                    parts.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/jpeg",
                        }
                    });
                } catch (e) {
                    console.error(`Error processing image ${img.url}`, e);
                }
            }
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();
        const jsonResponse = JSON.parse(text);

        return NextResponse.json(jsonResponse, { status: 200 });

    } catch (error: any) {
        console.error("Batch AI Grading Error:", error);
        return NextResponse.json({ message: "AI processing failed", error: error.message }, { status: 500 });
    }
}