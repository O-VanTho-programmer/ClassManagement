import { CheckCircle, Edit, ShieldAlert, ShieldCheck, ShieldOff, Upload } from 'lucide-react';
import React from 'react'

type TableStudentSubmissionsProps = {
    studentSubmissionsList: StudentWithHomework[],
    handleOpenUpload: (submission: StudentWithHomework) => void,
    handleOpenGrader: (submission: StudentWithHomework) => void,

}

export default function TableStudentSubmissions({
    studentSubmissionsList,
    handleOpenGrader,
    handleOpenUpload
}: TableStudentSubmissionsProps) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Security</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {studentSubmissionsList && studentSubmissionsList.map(submission => {
                    const isLate = submission.timing_status === 'Overdue';
                    const isGraded = submission.is_graded;

                    let badgeColor = 'bg-gray-100 text-gray-800';
                    let badgeText = submission.homework_status;

                    if (submission.is_graded_by_ai) {
                        badgeColor = 'bg-purple-100 text-purple-800';
                        badgeText = 'AI Grade';
                    } else if (submission.needs_review) {
                        badgeColor = 'bg-amber-100 text-amber-800 border border-amber-200';
                        badgeText = 'Need Review!';
                    } else if (isGraded) {
                        if (isLate) {
                            badgeColor = 'bg-orange-100 text-orange-800';
                            badgeText = 'Graded (Late)';
                        } else {
                            badgeColor = 'bg-green-100 text-green-800';
                            badgeText = 'Graded';
                        }
                    } else {
                        switch (submission.homework_status) {
                            case 'Submitted':
                                if (isLate) {
                                    badgeColor = 'bg-orange-100 text-orange-800';
                                    badgeText = 'Overdue';
                                } else {
                                    badgeColor = 'bg-blue-100 text-blue-800';
                                    badgeText = 'Submitted';
                                }
                                break;
                            case 'Pending':
                                badgeColor = 'bg-yellow-100 text-yellow-800';
                                break;
                            case 'Missed':
                                badgeColor = 'bg-red-100 text-red-800';
                                break;
                        }
                    }

                    return (
                        <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                                    {badgeText}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                {submission.grade ? `${submission.grade}%` : '--'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {submission.homework_status === 'Submitted' || submission.is_graded ? (
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit border ${
                                        submission.security_status === 'Verified'   ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        submission.security_status === 'Unverified' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                                      'bg-gray-50 text-gray-400 border-gray-100'
                                    }`}>
                                        {submission.security_status === 'Verified'   && <ShieldCheck size={12} />}
                                        {submission.security_status === 'Unverified' && <ShieldAlert size={12} />}
                                        {submission.security_status === 'None'       && <ShieldOff size={12} />}
                                        {submission.security_status || 'None'}
                                    </div>
                                ) : (
                                    <span className="text-gray-300 text-xs">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => handleOpenUpload(submission)}
                                    disabled={submission.submission_urls && submission.submission_urls.length > 0}
                                    className="text-gray-600 hover:text-blue-700 cursor-pointer disabled:hidden"
                                    title="Upload Submission"
                                >
                                    <Upload size={18} />
                                </button>
                                <button
                                    onClick={() => handleOpenGrader(submission)}
                                    disabled={!submission.submission_urls || submission.submission_urls.length === 0}
                                    className="cursor-pointer text-blue-600 hover:text-blue-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    title="Grade Submission"
                                >
                                    {submission.is_graded ? <Edit size={18} /> : <CheckCircle size={18} />}
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}