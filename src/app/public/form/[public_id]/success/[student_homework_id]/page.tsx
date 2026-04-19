'use client';

import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useUser } from '@/context/UserContext';
import { useGetStudentHomeworkByIdPublicQuery } from '@/hooks/useGetStudentHomeworkByIdPublic';
import formatDate from '@/utils/Format/formatDate';
import { BookOpen, Calendar, Check, Clock, Home, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function FormSuccess() {
    const { student_homework_id } = useParams();
    const router = useRouter();

    const user = useUser();
    const { data: studentHomework, isLoading, error } = useGetStudentHomeworkByIdPublicQuery(student_homework_id as string);

    if (isLoading) {
        return (
            <LoadingState fullScreen className='bg-gray-50' message='Verifying submission...' />
        );
    }

    if (error || !studentHomework) {
        return (
            <ErrorState fullScreen className='bg-gray-50' title='Submission Error' message={error?.message || "We couldn't verify your submission details. Please try refreshing the page."} />
        );
    }

    const isLate = studentHomework.homework_status === 'Late' || studentHomework.homework_status === 'Overdue';
    const timingColor = isLate ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    const timingLabel = isLate ? 'Late Submission' : 'On Time';

    const secStatus = studentHomework.security_status;
    const securityConfig = {
        Verified:   { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: ShieldCheck, label: 'Verified' },
        Unverified: { color: 'bg-amber-100 text-amber-700 border-amber-200',       icon: ShieldAlert, label: 'Unverified – Flagged for Review' },
        None:       { color: 'bg-gray-100 text-gray-500 border-gray-200',           icon: ShieldOff,   label: 'No Verification Required' },
    } as const;
    const secCfg = secStatus && secStatus in securityConfig
        ? securityConfig[secStatus as keyof typeof securityConfig]
        : securityConfig['None'];
    const SecurityIcon = secCfg.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Branded header */}
            <header className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2 text-blue-600 font-bold text-lg">
                    <BookOpen size={22} />
                    <span>TutorDesk</span>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-10">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-center relative overflow-hidden">
                        {/* Decorative blobs */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Check size={40} className="text-blue-600" strokeWidth={3} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-2">Submission Received!</h1>
                            <p className="text-blue-100 text-lg">Great job, {studentHomework.name}.</p>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="px-8 py-8 space-y-4">

                        {/* Timing status */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Submission</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${timingColor}`}>
                                {timingLabel}
                            </span>
                        </div>

                        {/* Security status */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Identity</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${secCfg.color}`}>
                                <SecurityIcon size={12} />
                                {secCfg.label}
                            </span>
                        </div>

                        {/* Submitted at */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 flex-shrink-0">
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Submitted at</p>
                                <p className="text-sm text-gray-900 font-semibold">{formatDate(studentHomework.submitted_date)}</p>
                            </div>
                        </div>

                        {/* Due date */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 flex-shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Due Date</p>
                                <p className="text-sm text-gray-900 font-semibold">{formatDate(studentHomework.due_date)}</p>
                            </div>
                        </div>

                        {/* Unverified notice */}
                        {secStatus === 'Unverified' && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                                <p className="font-semibold mb-0.5"> Identity not verified</p>
                                <p>Your submission was accepted but flagged as <strong>Unverified</strong> because face verification was not completed. Your teacher will review your submission manually.</p>
                            </div>
                        )}

                        {/* Return button for logged-in users */}
                        {user && (
                            <div className="pt-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-[0.98]"
                                >
                                    <Home size={16} className="mr-2" />
                                    Return to Home
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Submission ID: #{studentHomework.student_homework_id} • TutorDesk
                </p>
            </main>
        </div>
    );
}