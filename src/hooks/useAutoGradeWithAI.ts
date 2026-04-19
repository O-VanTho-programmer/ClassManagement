import { useState, useEffect } from "react";
import { gradeStudentHomeworkUseAI } from "@/lib/api/gradeStudentHomeworkUseAI";

export function useAutoGradeWithAI(
    submission?: StudentWithHomework, 
    studentQuestionBreakdown?: StudentHomeworkQuestionsInputDTO[] | null
) {
    const [isGrading, setIsGrading] = useState(false);
    const [grade, setGrade] = useState<number | undefined>(submission?.grade);
    const [feedback, setFeedback] = useState<string>(submission?.feedback || '');
    const [gradeBooks, setGradeBooks] = useState<StudentHomeworkQuestionsInputDTO[]>(studentQuestionBreakdown || []);
    const [isUnreadable, setIsUnreadable] = useState(false);
    const [confidenceScore, setConfidenceScore] = useState<number | null>(null);

    useEffect(() => {
        setGrade(submission?.grade);
        setFeedback(submission?.feedback || '');
        setGradeBooks(studentQuestionBreakdown || []);
        setIsUnreadable(false);
        setConfidenceScore(null);
    }, [submission, studentQuestionBreakdown]);

    const handleAutoGrade = async (submission_urls: ResultUpload[] | undefined, answerKey: string) => {
        const images = submission_urls;

        if (!images || images.length === 0) {
            alert("No submission image uploaded.");
            return;
        }

        if (!answerKey) {
            alert("No answer key set.");
            return;
        }

        setIsGrading(true);
        setIsUnreadable(false);
        setConfidenceScore(null);

        try {
            const res = await gradeStudentHomeworkUseAI(answerKey, images);

            if (res?.status === 200) {
                const data = res.data;
                
                setConfidenceScore(data.confidence_score ?? null);

                if (data.is_readable === false) {
                    // AI flagged image as unreadable — do NOT populate grade/questions
                    setIsUnreadable(true);
                    setGradeBooks([]);
                    setGrade(undefined);
                    setFeedback(data.feedback || "Image is too blurry or unreadable to grade accurately.");
                } else {
                    setIsUnreadable(false);
                    setGradeBooks(data.questions);
                    setGrade(data.grade);
                    setFeedback(data.feedback);
                }
            } else {
                setFeedback("An error occurred while grading. Please check the console.");
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setFeedback(`An error occurred while grading: ${(error as Error).message}`);
        } finally {
            setIsGrading(false);
        }
    };

    const handleUpdateGradeBooks = (index: number, newScore: number) => {
        const newGradeBooks = [...gradeBooks];
        newGradeBooks[index].grade = newScore; 
        setGradeBooks(newGradeBooks);        
    };

    return {
        isGrading,
        grade,
        setGrade,
        feedback,
        setFeedback,
        gradeBooks,
        handleAutoGrade,
        handleUpdateGradeBooks,
        isUnreadable,
        confidenceScore,
    };
}