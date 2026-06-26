import { AlertTriangle, CheckCircle, FileImage, FileText, Loader2, X } from "lucide-react";
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
    onApproveAIGrade?: () => void;
    isSaving: boolean;
    isApprovingAI?: boolean;
}

export default function SubmissionDetailsModal({
    isOpen,
    onClose,
    submission,
    answerKey,
    onSaveGrade,
    onApproveAIGrade,
    isSaving,
    isApprovingAI,
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
        handleUpdateGradeBooks,
        isUnreadable,
        confidenceScore,
    } = useAutoGradeWithAI(submission, studentQuestionBreakdown);

    const [showKey, setShowKey] = useState(false);
    const [isSavingQuestions, setIsSavingQuestions] = useState(false);
    const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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

    const isAIGraded = submission.is_graded_by_ai;
    const isNeedsReview = submission.needs_review;

    if (!isOpen) return null;

    // Determine confidence badge color
    const getConfidenceBadge = (score: number) => {
        if (score >= 80) return { color: 'bg-green-100 text-green-700 border-green-200', label: 'High' };
        if (score >= 50) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Medium' };
        return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Low' };
    };

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-4 transform transition-all duration-300 flex flex-col max-h-[95vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-800">Grade Submission: {submission.name}</h2>

                            {isAIGraded ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                    ✨ AI Graded Pending Approval
                                </span>
                            ) : <></>}
                            {isNeedsReview ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                    Need Review!
                                </span>
                            ) : <></>}
                        </div>
                        <IconButton icon={X} onClick={onClose} size={20} className='p-2 rounded-full text-gray-400 hover:bg-gray-100' />
                    </div>

                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden gap-1">
                        {/* LEFT COLUMN */}
                        <div className="overflow-y-auto p-4 bg-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Student's Work</h3>
                            {submission.submission_urls && submission.submission_urls.length > 0 ? (
                                <>
                                    <div className="h-[300px] flex items-center justify-center bg-gray-50 border rounded-md">
                                        {(() => {
                                            const currentPreviewUrl = selectedPreviewImage || submission.submission_urls[0].url;
                                            const isCurrentPdf = currentPreviewUrl.toLowerCase().includes('.pdf') || currentPreviewUrl.toLowerCase().includes('/pdf');
                                            const isCurrentDocx = currentPreviewUrl.toLowerCase().includes('.docx') || currentPreviewUrl.toLowerCase().includes('/raw');

                                            if (isCurrentPdf) {
                                                const imgPreviewUrl = currentPreviewUrl.replace(/\.pdf$/i, '.jpg');
                                                return (
                                                    <div className="relative w-full h-full flex flex-col bg-gray-100 items-center justify-center rounded-md border">
                                                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                                                            <a href={currentPreviewUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-md backdrop-blur-sm transition-all flex items-center gap-1">
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                        <img
                                                            src={imgPreviewUrl}
                                                            alt="PDF Preview"
                                                            className="w-full h-full object-contain bg-white cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => setZoomedImage(imgPreviewUrl)}
                                                        />
                                                    </div>
                                                );
                                            } else if (isCurrentDocx) {
                                                return (
                                                    <div className="flex flex-col items-center justify-center text-gray-500 w-full h-full bg-white border rounded-md">
                                                        <FileText size={64} className="mb-4 text-blue-500" />
                                                        <a href={currentPreviewUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer shadow-sm">
                                                            Download DOCX
                                                        </a>
                                                        <p className="mt-3 text-xs text-gray-400 text-center px-4">
                                                            Browser previews are disabled for Word documents. Please download to view.
                                                        </p>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className="w-full h-full relative cursor-pointer group" onClick={() => setZoomedImage(currentPreviewUrl)}>
                                                        <img
                                                            src={currentPreviewUrl}
                                                            alt="Student submission preview"
                                                            className="w-full h-full rounded-md object-contain border bg-white group-hover:opacity-90 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
                                                            <div className="bg-black/60 text-white px-3 py-1.5 rounded-md text-sm font-medium backdrop-blur-sm">Click to Zoom</div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-2 gap-2">
                                        {submission.submission_urls.map((item) => {
                                            const isItemPdf = item.url.toLowerCase().includes('.pdf') || item.url.toLowerCase().includes('/pdf');
                                            const isItemDocx = item.url.toLowerCase().includes('.docx') || item.url.toLowerCase().includes('/raw');
                                            const isItemDoc = isItemPdf || isItemDocx;

                                            return (
                                                <div
                                                    key={item.public_id}
                                                    onClick={() => setSelectedPreviewImage(item.url)}
                                                    className={`cursor-pointer border-2 rounded-md overflow-hidden h-[60px] flex items-center justify-center bg-white ${selectedPreviewImage === item.url ? 'border-blue-500' : 'border-transparent'}`}
                                                >
                                                    {isItemPdf ? (
                                                        <img src={item.url.replace(/\.pdf$/i, '.jpg')} alt="pdf thumb" className="w-full h-full object-cover" />
                                                    ) : isItemDocx ? (
                                                        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 text-gray-500">
                                                            <FileText size={24} />
                                                            <span className="text-[10px] font-medium mt-1 truncate px-1 text-center w-full">DOCX</span>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={item.url}
                                                            alt="thumb"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed rounded-lg">
                                    <FileImage size={48} />
                                    <p>No submission uploaded.</p>
                                </div>
                            )}
                        </div>

                        <div className="overflow-y-auto p-6 flex flex-col space-y-4">

                            {/* Unreadable Image Warning Banner */}
                            {isUnreadable && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 animate-pulse-once">
                                    <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
                                    <div>
                                        <p className="font-semibold text-sm">Blur Image – Review Needed</p>
                                        <p className="text-xs mt-0.5 text-amber-700">AI cannot read the homework clearly. The system has flagged this homework. Please review it manually or ask the student to submit a clearer image.</p>
                                    </div>
                                </div>
                            )}

                            {/* NeedsReview status banner (from DB) */}
                            {isNeedsReview && !isUnreadable ? (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-800">
                                    <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
                                    <div>
                                        <p className="font-semibold text-sm">Ảnh mờ – Yêu cầu giáo viên chấm tay</p>
                                        <p className="text-xs mt-0.5 text-amber-700">AI đã phát hiện ảnh không đọc được khi chấm hàng loạt. Vui lòng chấm thủ công.</p>
                                    </div>
                                </div>
                            ) : <></>}

                            <button
                                onClick={() => {
                                    const urlsForGrading = submission.submission_urls?.map(item => ({
                                        ...item,
                                        url: item.url.toLowerCase().includes('.pdf') ? item.url.replace(/\.pdf$/i, '.jpg') : item.url
                                    })) || [];
                                    handleAutoGrade(urlsForGrading, answerKey);
                                }}
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

                            {/* Confidence Score Badge */}
                            {confidenceScore !== null && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">AI Confidence:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${confidenceScore >= 80 ? 'bg-green-500' : confidenceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${confidenceScore}%` }}
                                        />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getConfidenceBadge(confidenceScore).color}`}>
                                        {confidenceScore}% – {getConfidenceBadge(confidenceScore).label}
                                    </span>
                                </div>
                            )}

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
                        {isAIGraded && onApproveAIGrade ? (
                            <button
                                onClick={onApproveAIGrade}
                                disabled={isApprovingAI || isSaving || isSavingQuestions}
                                className="px-6 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 disabled:bg-gray-400 disabled:from-gray-400 flex items-center gap-2 font-medium shadow-md"
                            >
                                {isApprovingAI ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                Approve AI Grade
                            </button>
                        ) : <></>}
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

                {/* Zoom Modal Overlay */}
                {zoomedImage && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setZoomedImage(null)}
                    >
                        <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-colors z-10"
                                onClick={() => setZoomedImage(null)}
                                aria-label="Close Zoom"
                            >
                                <X size={28} />
                            </button>
                            <img
                                src={zoomedImage}
                                alt="Zoomed preview"
                                className="max-w-full max-h-full object-contain cursor-zoom-out"
                                onClick={() => setZoomedImage(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}