'use client';

import { useAlert } from '@/components/AlertProvider/AlertContext';
import FaceRecognitionAuth from '@/components/FaceSecurity/FaceRecognitionAuth';
import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useFileImg } from '@/hooks/useFileImg';
import { useGetClassHomeworkByIdPublic } from '@/hooks/useGetClassHomeworkByIdPublic';
import { useGetStudentListByAssignmentIdPublic } from '@/hooks/useGetStudentListByAssignmentIdPublic';
import { useUploadSubmissionMutation } from '@/hooks/useUploadSubmission';
import { getUrlImageByUploadOnCloudiaryPublic } from '@/lib/api/getUrlImageByUploadOnCloudiaryPublic';
import { saveStudentSubmissionPublic } from '@/lib/api/HomeworkSubmission/saveStudentSubmissionPublic';
import { isFaceAuthEnablePublic } from '@/utils/face-recognition/isFaceAuthEnable';
import { AlertTriangle, BookOpen, Calendar, CheckCircle2, Copy, FileText, Link2, Loader2, Send, ShieldAlert, ShieldCheck, ShieldOff, Trash2, Upload, User, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useMemo } from 'react'

type SecurityStatus = 'Verified' | 'Unverified' | 'None';

function AssignmentForm() {
    const { public_id } = useParams();
    const router = useRouter();

    const { data: assignment, isLoading: isAssignmentLoading, isError: isAssignmentError, error: assignmentError } = useGetClassHomeworkByIdPublic(public_id as string);
    const { data: studentLists, isLoading: isStudentListsLoading, isError: isStudentListsError, error: studentListsError } = useGetStudentListByAssignmentIdPublic(public_id as string);
    const { data: isFaceAuthEnable } = isFaceAuthEnablePublic(public_id as string);

    const { showAlert } = useAlert();

    const [faceVerified, setFaceVerified] = useState<boolean>(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const { files, previews, handleFileChange, handleRemoveFile } = useFileImg(showAlert);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const selectedStudent = useMemo(() => {
        return studentLists?.find(s => s.id.toString() === selectedStudentId);
    }, [studentLists, selectedStudentId]);

    const allPreviews = useMemo(() => {
        const existingSubmissions = selectedStudent?.submission_urls?.map(sub => sub.url) || [];
        return [...existingSubmissions, ...previews];
    }, [selectedStudent, previews]);

    // Compute security status label for submission
    const securityStatus: SecurityStatus = useMemo(() => {
        if (!isFaceAuthEnable) return 'None';
        return faceVerified ? 'Verified' : 'Unverified';
    }, [isFaceAuthEnable, faceVerified]);

    const uploadMutation = useUploadSubmissionMutation(
        getUrlImageByUploadOnCloudiaryPublic,
        saveStudentSubmissionPublic,
    );

    if (isAssignmentLoading || isStudentListsLoading) {
        return <LoadingState fullScreen className='bg-gray-50' />;
    }

    if (isAssignmentError || isStudentListsError) {
        return <ErrorState fullScreen className='bg-gray-50' message={assignmentError?.message || studentListsError?.message || 'Something went wrong.'} />;
    }

    const handleSubmit = () => {
        try {
            if (!files || files.length === 0) {
                showAlert("Please upload at least one file.", "error");
                return;
            }
            if (!selectedStudentId) {
                showAlert("Please select your name first.", "error");
                return;
            }

            uploadMutation.mutate({
                files,
                student_homework_id: selectedStudent!.student_homework_id,
                due_date: assignment!.due_date,
                securityStatus,
            }, {
                onSuccess: () => {
                    router.push(`/public/form/${public_id}/success/${selectedStudent!.student_homework_id}`);
                }
            });
        } catch (error) {
            showAlert("Internal server error", "error");
        }
    };

    const handleCopyLinkForm = () => {
        const link = `${window.location.origin}/public/form/${public_id}`;
        navigator.clipboard.writeText(link);
        showAlert("Link copied to clipboard!", "success");
    };

    const handleSelectStudent = (studentId: string) => {
        if (studentId === selectedStudentId) {
            setSelectedStudentId('');
            setFaceVerified(false);
            return;
        }
        setFaceVerified(false);
        setSelectedStudentId(studentId);

        if (isFaceAuthEnable) {
            setIsDetecting(true);
        }
    };

    const handleSuccessFaceAuth = () => {
        setFaceVerified(true);
        setIsDetecting(false);
    };

    const canUploadFiles = !isFaceAuthEnable || faceVerified;

    // Check if past due
    const isPastDue = assignment?.due_date ? new Date(assignment.due_date) < new Date() : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Top branded header */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                        <BookOpen size={22} />
                        <span>TutorDesk</span>
                    </div>
                    <button
                        onClick={handleCopyLinkForm}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100"
                    >
                        <Link2 size={14} />
                        Copy Link
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

                {/* Assignment Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        <Users size={12} />
                                        {assignment?.class_name}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isPastDue ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                        <Calendar size={12} />
                                        Due: {assignment?.due_date || '--'}
                                        {isPastDue && ' (Overdue)'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{assignment?.title}</h1>
                            </div>
                        </div>

                        {assignment?.content && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <FileText size={12} /> Instructions
                                </p>
                                <div
                                    className="text-sm text-gray-600 leading-relaxed overflow-hidden max-h-[120px]"
                                    dangerouslySetInnerHTML={{ __html: assignment?.content || '' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Security status info banner */}
                {isFaceAuthEnable && (
                    <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
                        faceVerified
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                        {faceVerified
                            ? <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                            : <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-amber-500" />
                        }
                        <div>
                            {faceVerified ? (
                                <>
                                    <p className="font-semibold">Identity Verified ✓</p>
                                    <p className="text-xs font-normal mt-0.5 text-emerald-700">Your face was successfully matched. Submission will be marked as <strong>Verified</strong>.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold">Face Verification Required</p>
                                    <p className="text-xs font-normal mt-0.5 text-amber-700">
                                        This assignment requires face verification. You can still submit without verifying, but your submission will be marked as <strong>Unverified</strong> and flagged for teacher review.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Submission form card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Send size={16} className="text-blue-600" />
                        Submit Your Work
                    </h2>

                    {/* Student selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <User size={14} className="text-gray-400" />
                            Who are you? <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => handleSelectStudent(e.target.value)}
                            className="block w-full px-3 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="" disabled>Select your name...</option>
                            {studentLists?.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <p className="mt-1.5 text-xs text-gray-400">Can't find your name? Contact your teacher.</p>
                    </div>

                    {/* Face verify action — show after picking student when not yet verified */}
                    {selectedStudentId && isFaceAuthEnable && !faceVerified && (
                        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <ShieldAlert size={18} className="text-amber-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-amber-800">Not verified yet</p>
                                <p className="text-xs text-amber-700">Verify now for a Verified submission, or skip to submit as Unverified.</p>
                            </div>
                            <button
                                onClick={() => setIsDetecting(true)}
                                className="flex-shrink-0 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                                Verify Face
                            </button>
                        </div>
                    )}

                    {/* File upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                            <Upload size={14} className="text-gray-400" />
                            Upload Files <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {allPreviews.map((src, idx) => {
                                const existingCount = selectedStudent?.submission_urls?.length || 0;
                                const isExisting = idx < existingCount;
                                const isPdf = src.toLowerCase().includes('.pdf') || src.toLowerCase().includes('/pdf');

                                return (
                                    <div key={`${isExisting ? 'ex' : 'new'}-${idx}`} className="relative group rounded-xl overflow-hidden border border-gray-200 h-28 bg-gray-50 shadow-sm">
                                        {isPdf ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <FileText size={28} className="text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-500 font-medium">PDF</span>
                                            </div>
                                        ) : (
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                        {isExisting ? (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-[10px] font-bold px-1.5 py-0.5 bg-blue-500 rounded">Existing</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    const existingCount = selectedStudent?.submission_urls?.length || 0;
                                                    handleRemoveFile(idx - existingCount);
                                                }}
                                                className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                            <label className="border-2 border-dashed border-blue-200 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group">
                                <Upload size={20} className="text-blue-400 group-hover:text-blue-600 mb-1 transition-colors" />
                                <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-700">Add File</span>
                                <span className="text-[10px] text-gray-400 mt-0.5">IMG or PDF</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf"
                                    multiple
                                />
                            </label>
                        </div>

                        {files && files.length > 0 && (
                            <p className="text-xs text-gray-500">{files.length} new file{files.length > 1 ? 's' : ''} selected</p>
                        )}
                    </div>

                    {/* Security status preview */}
                    {selectedStudentId && (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${
                            securityStatus === 'Verified'   ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            securityStatus === 'Unverified' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                              'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                            {securityStatus === 'Verified'   && <ShieldCheck size={14} />}
                            {securityStatus === 'Unverified' && <ShieldAlert size={14} />}
                            {securityStatus === 'None'       && <ShieldOff size={14} />}
                            This submission will be labelled: <span className="font-bold ml-0.5">{securityStatus}</span>
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStudentId || !files || files.length === 0 || uploadMutation.isPending}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                    >
                        {uploadMutation.isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Submit Homework
                            </>
                        )}
                    </button>

                    {/* Unverified notice below button */}
                    {isFaceAuthEnable && !faceVerified && selectedStudentId && (
                        <p className="text-center text-xs text-amber-600 flex items-center justify-center gap-1">
                            <AlertTriangle size={12} />
                            Submitting without face verification will flag this as <strong className="mx-0.5">Unverified</strong>.
                        </p>
                    )}
                </div>

                <p className="text-center text-xs text-gray-400 pb-4">
                    Powered by TutorDesk • Secure homework submission
                </p>
            </main>

            {/* Face Auth Modal */}
            {isDetecting && isFaceAuthEnable && selectedStudent && (
                <FaceRecognitionAuth
                    isOpen={isDetecting}
                    onClose={() => setIsDetecting(false)}
                    studentDescriptor={selectedStudent?.face_descriptor ? (
                        typeof selectedStudent.face_descriptor === 'string'
                            ? selectedStudent.face_descriptor
                            : JSON.stringify(selectedStudent.face_descriptor)
                    ) : null}
                    onAuthenticated={handleSuccessFaceAuth}
                />
            )}
        </div>
    );
}

export default AssignmentForm;