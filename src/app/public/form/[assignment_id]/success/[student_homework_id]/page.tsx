'use client';

import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useUser } from '@/context/UserContext';
import { useGetStudentHomeworkByIdQuery } from '@/hooks/useGetStudentHomeworkById';
import formatDate from '@/utils/Format/formatDate';
import { ArrowRight, Calendar, Check, Clock, Home } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function FormSuccess() {
    const { student_homework_id } = useParams();
    const router = useRouter();

    const user = useUser();
    const { data: studentHomework, isLoading, error } = useGetStudentHomeworkByIdQuery(student_homework_id as string);

    if (isLoading) {
        return (
            <LoadingState fullScreen className='bg-white' message='Verifying submission...' />
        );
    }

    if (error || !studentHomework) {

        return (
            <ErrorState fullScreen className='bg-white' title='Submission Error' message={error?.message || "We couldn't verify your submission details. Please try refreshing the page."} />
        );
    }

    // Determine status color
    const isLate = studentHomework.homework_status === 'Late';
    const statusColor = isLate ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200';
    const statusIcon = isLate ? '⚠️ Late Submission' : '✅ On Time';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-xl w-full">

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Header Section */}
                    <div className="bg-blue-600 px-8 py-12 text-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-in zoom-in duration-500">
                                <Check size={40} className="text-blue-600" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-2">
                                Submission Received!
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Great job, {studentHomework.name}.
                            </p>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="px-8 py-8">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">

                            {/* Status Badge */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusColor}`}>
                                    {statusIcon}
                                </span>
                            </div>

                            {/* Submission Time */}
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Submitted at</p>
                                    <p className="text-gray-900 font-semibold">
                                        {formatDate(studentHomework.submitted_date)}
                                    </p>
                                </div>
                            </div>

                            {/* Due Date Info */}
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                                    <p className="text-gray-900 font-semibold">
                                        {formatDate(studentHomework.due_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {user && (
                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full cursor-pointer flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all transform active:scale-[0.98]"
                                >
                                    <Home size={18} className="mr-2" />
                                    Return to Home
                                </button>
                                {/* <button
                                    className="w-full cursor-pointer flex items-center justify-center px-6 py-3.5 border border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                                >
                                    View Assignment Details <ArrowRight size={16} className="ml-2" />
                                </button> */}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Submission ID: #{studentHomework.student_homework_id} • Class Hub
                </p>
            </div>
        </div>
    );
}