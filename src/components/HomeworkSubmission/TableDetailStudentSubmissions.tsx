'use client';

import React from 'react';
import { Loader2, Edit, Eye } from 'lucide-react';
import LoadingState from '../QueryState/LoadingState';
import ErrorState from '../QueryState/ErrorState';
import IconButton from '../IconButton/IconButton';

interface TableDetailStudentSubmissionsProps {
    studentSubmissionsList: StudentWithHomework[],
    handleOpenGrader: (submission: StudentWithHomework) => void,
    isLoading: boolean,
    isError: boolean,
    error?: string | null,
    total_question: number,
    students_homework_questions:StudentHomeworkQuestions[],
}

export default function TableDetailStudentSubmissions({
    studentSubmissionsList,
    handleOpenGrader,
    isLoading,
    isError,
    error,
    total_question,
    students_homework_questions,
}: TableDetailStudentSubmissionsProps) {

    if (isLoading) {
        return <LoadingState message='Loading gradebook...' />
    }

    if (isError) {
        return <ErrorState message={error || 'Error loading gradebook'} />
    }

    const questionColumns = Array.from({ length: total_question }, (_, i) => i + 1);

    const onOpenGrader = (studentId: string) => {
        const selectedStudentSubmission = studentSubmissionsList.find(student => student.id == studentId);
        
        if (selectedStudentSubmission === undefined) {
            return;
        }

        handleOpenGrader(selectedStudentSubmission);
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Homework Gradebook</h1>

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
                            {students_homework_questions.map((student) => (
                                <tr key={student.student_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                                        {student.student_name}
                                        <div className={`text-xs mt-1 font-normal ${student.homework_status === 'Finished' ? 'text-green-600' :
                                            student.homework_status === 'Late' ? 'text-orange-600' : 'text-gray-400'
                                            }`}>
                                            {student.homework_status}
                                        </div>
                                    </td>

                                    {/* Total Score */}
                                    <td className="px-4 py-4 text-center">
                                        {student.total_score !== null ? (
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {student.total_score}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>

                                    {/* Question Scores */}
                                    {student.questions.length > 0 ? (
                                        student.questions.map((q, idx) => {
                                            const grade = q.grade;
                                            return (
                                                <td key={idx} className="px-3 py-4 text-center text-sm text-gray-700 border-l border-gray-100">
                                                    {grade !== undefined ? grade + "/" + q.max_grade : <span className="text-gray-300 text-xs">--</span>}
                                                </td>
                                            );
                                        })) : (
                                        Array.from({ length: total_question }).map((_, idx) => (
                                            <td key={idx} className="px-3 py-4 text-center text-sm text-gray-700 border-l border-gray-100">
                                                <span className="text-gray-300 text-xs">--</span>
                                            </td>
                                        ))
                                    )}

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {student.homework_status === 'Pending' || student.homework_status === 'Missed' ? (
                                            <span className="text-gray-400 text-xs italic">No Submission</span>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <IconButton className='text-blue-600 hover:text-blue-900' icon={Edit} size={18} onClick={() => onOpenGrader(student.student_id)} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}