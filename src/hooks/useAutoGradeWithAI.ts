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

    useEffect(() => {
        setGrade(submission?.grade);
        setFeedback(submission?.feedback || '');
        setGradeBooks(studentQuestionBreakdown || []);
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

        try {
            const res = await gradeStudentHomeworkUseAI(answerKey, images);

            if (res?.status === 200) {
                const data = res.data;
                
                setGradeBooks(data.questions);
                setGrade(data.grade);
                setFeedback(data.feedback);
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
    };
}