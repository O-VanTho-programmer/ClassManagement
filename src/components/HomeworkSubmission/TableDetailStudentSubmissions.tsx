'use client';

import React, { useMemo, useState } from 'react';
import { Edit, Loader2, Sparkles } from 'lucide-react';
import LoadingState from '../QueryState/LoadingState';
import ErrorState from '../QueryState/ErrorState';
import IconButton from '../IconButton/IconButton';
import Button from '../Button/Button';
import { addStudentHomeworkQuestion } from '@/lib/api/addStudentHomeworkQuestion';
import { saveGrade } from '@/lib/api/HomeworkSubmission/saveGrade';
import { useQueryClient } from '@tanstack/react-query';
import { gradeStudentHomeworkBatchUseAI } from '@/lib/api/gradeStudentHomeworkBatchUseAI';
import { useAlert } from '../AlertProvider/AlertContext';
import { saveGradeAndStudentHomeworkQuestion } from '@/lib/api/HomeworkSubmission/saveGradeAndStudentHomeworkQuestion';

interface TableDetailStudentSubmissionsProps {
    studentSubmissionsList: StudentWithHomework[],
    handleOpenGrader: (submission: StudentWithHomework) => void,
    isLoading: boolean,
    isError: boolean,
    error?: string | null,
    total_question: number,
    students_homework_questions: StudentHomeworkQuestions[],
    answerKey: string,
    class_homework_id: string,
}

export default function TableDetailStudentSubmissions({
    studentSubmissionsList,
    handleOpenGrader,
    isLoading,
    isError,
    error,
    total_question,
    students_homework_questions,
    class_homework_id,
    answerKey,
}: TableDetailStudentSubmissionsProps) {

    if (isLoading) {
        return <LoadingState message='Loading gradebook...' />
    }

    if (isError) {
        return <ErrorState message={error || 'Error loading gradebook'} />
    }

    const queryClient = useQueryClient();
    const { showAlert } = useAlert();

    const questionColumns = Array.from({ length: total_question }, (_, i) => i + 1);

    const [isGrading, setIsGrading] = useState<boolean>(false);
    const [gradingStudent, setGradingStudent] = useState<string[]>([]);

    const mapStudentSubmissionList = useMemo(() => {
        const mapStudentSubmissions = new Map<string, StudentWithHomework>();

        studentSubmissionsList.forEach((s) => {
            mapStudentSubmissions.set(s.id, s);
            // s.id is student id
        });

        return mapStudentSubmissions;
    }, [studentSubmissionsList]);

    const onOpenGrader = (studentId: string) => {
        const selectedStudentSubmission = mapStudentSubmissionList.get(studentId);

        if (selectedStudentSubmission === undefined) {
            return;
        }

        handleOpenGrader(selectedStudentSubmission);
    }

    const handleGradeAllBatch = async () => {
        if (!answerKey) {
            showAlert("Please set an Answer Key first.", 'warning');
            return;
        }

        setIsGrading(true);

        try {
            for (let i = 0; i < students_homework_questions.length; i += 5) {
                let submissionsBatch = [];
                let batchStudentIds: string[] = [];

                for (let j = 0; j < 5 && i + j < students_homework_questions.length; j++) {
                    const studentId = students_homework_questions[i + j].student_id;
                    const submission = mapStudentSubmissionList.get(studentId);

                    if (!submission || !submission.submission_urls || submission.submission_urls.length === 0) {
                        continue;
                    }

                    batchStudentIds.push(studentId);
                    submissionsBatch.push(submission);
                }

                if (batchStudentIds.length > 0) {
                    setGradingStudent(batchStudentIds);
                }

                try {
                    const aiRes = await gradeStudentHomeworkBatchUseAI(answerKey, submissionsBatch);

                    if (aiRes?.status === 200 && aiRes.data) {
                        const submissionsRes = aiRes.data;

                        for (let submission of submissionsRes) {
                            const { grade, feedback, questions } = submission;
                            await saveGrade(submission.student_homework_id, grade, feedback);
                            await addStudentHomeworkQuestion(submission.student_homework_id, questions);
                            await saveGradeAndStudentHomeworkQuestion(submission.student_homework_id, grade, feedback, questions);
                        }


                        queryClient.invalidateQueries({ queryKey: ['student_homework_question_by_class_homework_id', class_homework_id] })
                    }
                } catch (err) {
                    console.error(`Failed to grade student`, err);
                } finally {
                    setGradingStudent([]);
                }
            }
        } catch (error) {
            console.error("Batch grading failed", error);
            alert("An error occurred during batch grading.");
        } finally {
            setIsGrading(false);
            setGradingStudent([]);
        }
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Homework Gradebook</h1>
                <Button style='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed'
                    color='blue' title='Grade All' onClick={handleGradeAllBatch}
                    disabled={isGrading}
                    isSaving={isGrading}
                    icon={isGrading ? Loader2 : Sparkles}
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-100 z-10">
                                    Student Name
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                {/* Dynamic Question Columns */}
                                {questionColumns.map(qNum => (
                                    <th key={qNum} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-gray-200">
                                        Q{qNum}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students_homework_questions.map((student) => {
                                const isGradingThisStudent = gradingStudent.includes(student.student_id);

                                let statusColor = "bg-gray-100 text-gray-600";
                                let statusText = student.homework_status;

                                if (isGradingThisStudent) {
                                    statusColor = "bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse";
                                    statusText = "AI Grading...";
                                } else {
                                    switch (student.homework_status) {
                                        case 'Finished':
                                        case 'Graded':
                                            statusColor = 'bg-green-100 text-green-700';
                                            break;
                                        case 'Late':
                                            statusColor = 'bg-orange-100 text-orange-700';
                                            break;
                                        case 'Missed':
                                            statusColor = 'bg-red-100 text-red-700';
                                            break;
                                        case 'Submitted':
                                        case 'Uploaded':
                                            statusColor = 'bg-blue-100 text-blue-700';
                                            break;
                                    }
                                }

                                return (
                                    <tr
                                        key={student.student_id}
                                        className={`transition-colors duration-200 ${isGradingThisStudent ? 'bg-indigo-50/20' : 'hover:bg-gray-50'}`}
                                    >
                                        {/* --- Student Name & Status --- */}
                                        <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit z-10">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{student.student_name}</span>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
                                                        {statusText}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            {isGradingThisStudent ? (
                                                <div className="w-10 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
                                            ) : (
                                                student.total_score !== null ? (
                                                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${Number(student.total_score) >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.total_score}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )
                                            )}
                                        </td>

                                        {/* --- Question Scores (Dynamic Columns) --- */}
                                        {Array.from({ length: total_question }, (_, i) => i + 1).map((qNum) => {
                                            // Find data for this specific column #
                                            const questionData = student.questions.find(q => q.question_number === qNum);

                                            return (
                                                <td key={qNum} className="px-3 py-4 text-center text-sm border-l border-gray-100">
                                                    {isGradingThisStudent ? (
                                                        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse mx-auto opacity-70" />
                                                    ) : (
                                                        questionData ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-medium text-gray-700">{questionData.grade}</span>
                                                                <span className="text-[10px] text-gray-400">/{questionData.max_grade}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">--</span>
                                                        )
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* --- Actions --- */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {isGradingThisStudent ? (
                                                <span className="text-indigo-500 text-xs flex items-center justify-end gap-1">
                                                    <Loader2 size={14} className="animate-spin" /> Processing
                                                </span>
                                            ) : (
                                                student.homework_status === 'Pending' || student.homework_status === 'Missed' ? (
                                                    <span className="text-gray-400 text-xs italic cursor-default">No Submission</span>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <IconButton
                                                            className='text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                                                            icon={Edit}
                                                            size={18}
                                                            onClick={() => onOpenGrader(student.student_id)}
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}