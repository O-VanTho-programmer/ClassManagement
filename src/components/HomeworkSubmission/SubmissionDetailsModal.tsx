import { FileImage, Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "../IconButton/IconButton";
import { gradeStudentHomeworkUseAI } from "@/lib/api/gradeStudentHomeworkUseAI";
import { addStudentHomeworkQuestion } from "@/lib/api/addStudentHomeworkQuestion";
import QuestionBreakDown from "./QuestionBreakDown";

interface SubmissionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: StudentWithHomework;
    studentQuestionBreakdown: StudentHomeworkQuestion[] | null;
    answerKey: string;
    onSaveGrade: (grade: number, feedback: string) => void;
    isSaving: boolean;
}

export default function SubmissionDetailsModal({ isOpen, onClose, submission, answerKey, onSaveGrade, isSaving, studentQuestionBreakdown }: SubmissionDetailsModalProps) {
    const [isGrading, setIsGrading] = useState(false);
    const [grade, setGrade] = useState<number | undefined>(submission.grade);
    const [feedback, setFeedback] = useState<string>(submission.feedback || '');
    const [gradeBooks, setGradeBooks] = useState<StudentHomeworkQuestionsInputDTO[]>(studentQuestionBreakdown || []);
    const [showKey, setShowKey] = useState(false);

    const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (submission) {
            setGrade(submission.grade || undefined);
            setFeedback(submission.feedback || '');
        }
    }, [submission, isOpen]);

    const handleAutoGrade = async () => {
        const images = submission.submission_urls;

        if (!images || images.length === 0) {
            alert("No submission image uploaded.");
            return;
        }

        if (!answerKey) {
            alert("No answer key set.")
            return;
        }

        setIsGrading(true);
        setFeedback('');

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
            setFeedback(`An error occurred while grading: ${(error as Error)}`);
        } finally {
            setIsGrading(false);
        }
    };

    const handleUpdateGradeBooks = (index: number, grade: number) => {
        const newGradeBooks = [...gradeBooks];
        newGradeBooks[index].grade = grade;
        setGradeBooks(newGradeBooks);
    };

    const handleSave = () => {
        if (grade !== undefined && feedback) {
            onSaveGrade(grade, feedback);
            addStudentHomeworkQuestion(submission.student_homework_id, gradeBooks);
        } else {
            alert("Please generate or enter a grade and feedback before saving.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-4 transform transition-all duration-300 flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Grade Submission: {submission.name}</h2>
                    <IconButton icon={X} onClick={onClose} size={20} className='p-2 rounded-full text-gray-400 hover:bg-gray-100' />
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden gap-1">
                    {/* Student Submission Image */}
                    <div className="overflow-y-auto p-4 bg-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Student's Work</h3>
                        {submission.submission_urls && submission.submission_urls.length > 0 ? (
                            <>
                                <div className="h-[300px]">
                                    <img
                                        src={selectedPreviewImage || submission.submission_urls[0].url}
                                        alt="Student submission preview"
                                        className="w-full h-full rounded-md object-contain border"
                                    />
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-2 gap-1">
                                    {submission.submission_urls?.map((item: ResultUpload) => (
                                        <img
                                            key={item.public_id}
                                            src={item.url}
                                            alt={`Student submission ${item.public_id}`}
                                            className={`w-full h-[60px] rounded-md ${selectedPreviewImage === item.url ? 'border-2 border-blue-500' : ''}`}
                                            onClick={() => setSelectedPreviewImage(item.url)}
                                        />
                                    ))}
                                </div>
                            </>


                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <FileImage size={48} />
                                <p className="mt-2">No submission image uploaded.</p>
                            </div>
                        )}
                    </div>

                    {/* Grading Panel */}
                    <div className="overflow-y-auto p-6 flex flex-col space-y-4">
                        <button
                            onClick={handleAutoGrade}
                            disabled={isGrading || !answerKey || !submission.submission_urls}
                            className="w-full cursor-pointer flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed"
                        >
                            {isGrading ? (
                                <Loader2 size={20} className="animate-spin mr-2" />
                            ) : (
                                <Sparkles size={20} className="mr-2 text-amber-300" />
                            )}
                            {isGrading ? 'Grading...' : 'Auto-Grade with AI'}
                        </button>
                        {!answerKey && <p className="text-xs text-center text-yellow-700">Set an answer key to enable AI grading.</p>}

                        {/* Grade & Feedback */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Grade (0-100)</label>
                            <input
                                type="number"
                                value={grade || ''}
                                onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="--"
                                className="mt-1 w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-lg font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Feedback</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={isGrading ? "Generating feedback..." : "Provide feedback for the student..."}
                                rows={6}
                                className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        {gradeBooks.length > 0 && (
                           <QuestionBreakDown gradeBooks={gradeBooks} updateQuestionGrade={handleUpdateGradeBooks}/>
                        )}

                        {/* Answer Key Accordion */}
                        <div>
                            <button onClick={() => setShowKey(!showKey)} className="text-sm font-medium text-gray-600 hover:text-black">
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
                    <button type="button" onClick={onClose} className="px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={isGrading || isSaving} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Grade'}
                    </button>
                </div>
            </div>
        </div>
    );
}
