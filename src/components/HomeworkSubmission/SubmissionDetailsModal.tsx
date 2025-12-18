import { FileImage, Loader2, X } from "lucide-react";
import { useState } from "react";
import IconButton from "../IconButton/IconButton";
import { addStudentHomeworkQuestion } from "@/lib/api/addStudentHomeworkQuestion";
import QuestionBreakDown from "./QuestionBreakDown";
import { useAutoGradeWithAI } from "@/hooks/useAutoGradeWithAI";
import Button from "../Button/Button";

interface SubmissionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: StudentWithHomework;
    studentQuestionBreakdown: StudentHomeworkQuestionsInputDTO[] | null;
    answerKey: string;
    onSaveGrade: (grade: number, feedback: string) => void;
    isSaving: boolean;
}

export default function SubmissionDetailsModal({
    isOpen,
    onClose,
    submission,
    answerKey,
    onSaveGrade,
    isSaving,
    studentQuestionBreakdown
}: SubmissionDetailsModalProps) {

    const {
        isGrading,
        grade,
        setGrade,
        feedback,
        setFeedback,
        gradeBooks,
        handleAutoGrade,
        handleUpdateGradeBooks
    } = useAutoGradeWithAI(submission, studentQuestionBreakdown);

    const [showKey, setShowKey] = useState(false);
    const [isSavingQuestions, setIsSavingQuestions] = useState(false);
    const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

    const handleSave = async () => {
        if (grade !== undefined && feedback) {
            try {
                setIsSavingQuestions(true);

                if (gradeBooks.length > 0) {
                    await addStudentHomeworkQuestion(submission.student_homework_id, gradeBooks);
                }
                onSaveGrade(grade, feedback);
            } catch (error) {
                alert("Failed to save question breakdown. Please try again.");
                console.error(error);
            } finally {
                setIsSavingQuestions(false);
            }
        } else {
            alert("Please generate or enter a grade and feedback before saving.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-4 transform transition-all duration-300 flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Grade Submission: {submission.name}</h2>
                    <IconButton icon={X} onClick={onClose} size={20} className='p-2 rounded-full text-gray-400 hover:bg-gray-100' />
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden gap-1">
                    {/* LEFT COLUMN: Images */}
                    <div className="overflow-y-auto p-4 bg-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Student's Work</h3>
                        {submission.submission_urls && submission.submission_urls.length > 0 ? (
                            <>
                                <div className="h-[300px]">
                                    <img
                                        src={selectedPreviewImage || submission.submission_urls[0].url}
                                        alt="Student submission preview"
                                        className="w-full h-full rounded-md object-contain border bg-white"
                                    />
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-2 gap-2">
                                    {submission.submission_urls.map((item) => (
                                        <div
                                            key={item.public_id}
                                            onClick={() => setSelectedPreviewImage(item.url)}
                                            className={`cursor-pointer border-2 rounded-md overflow-hidden h-[60px] ${selectedPreviewImage === item.url ? 'border-blue-500' : 'border-transparent'}`}
                                        >
                                            <img
                                                src={item.url}
                                                alt="thumb"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed rounded-lg">
                                <FileImage size={48} />
                                <p>No submission image uploaded.</p>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto p-6 flex flex-col space-y-4">

                        <button
                            onClick={() => handleAutoGrade(submission.submission_urls, answerKey)}
                            disabled={isGrading || !answerKey || !submission.submission_urls}
                            className="w-full flex items-center justify-center cursor-pointer px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:bg-gray-300 disabled:from-gray-300 disabled:cursor-not-allowed"
                        >
                            {isGrading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin mr-2" />
                                    AI is Grading...
                                </>
                            ) : (
                                "✨ Auto-Grade with AI"
                            )}
                        </button>

                        {!answerKey && <p className="text-xs text-red-500">⚠️ Please set an Answer Key first.</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Grade</label>
                            <input
                                type="number"
                                value={grade ?? ''}
                                onChange={(e) => setGrade(Number(e.target.value))}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-bold"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Feedback</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm h-32"
                                placeholder="Enter feedback..."
                            />
                        </div>

                        {gradeBooks.length > 0 && (
                            <QuestionBreakDown
                                gradeBooks={gradeBooks}
                                updateQuestionGrade={handleUpdateGradeBooks}
                            />
                        )}

                        <div>
                            <button onClick={() => setShowKey(!showKey)} className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black">
                                {showKey ? 'Hide' : 'Show'} Answer Key
                            </button>
                            {showKey && (
                                <pre className="mt-2 p-3 bg-gray-50 border rounded-md text-sm text-gray-700 max-h-48 overflow-y-auto font-mono">
                                    {answerKey || "No answer key set."}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end gap-3 border-t bg-gray-50 rounded-b-xl">
                    <Button
                        title="Cancel"
                        onClick={onClose}
                        color="white"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isGrading || isSaving || isSavingQuestions}
                        className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                    >
                        {(isSaving || isSavingQuestions) && <Loader2 size={16} className="animate-spin mr-2" />}
                        Save Grade
                    </button>
                </div>
            </div>
        </div>
    );
}