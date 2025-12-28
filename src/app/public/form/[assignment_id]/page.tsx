'use client';

import { useAlert } from '@/components/AlertProvider/AlertContext';
import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useFileImg } from '@/hooks/useFileImg';
import { useGetClassHomeworkById } from '@/hooks/useGetClassHomeworkById';
import { useGetStudentListByAssignmentId } from '@/hooks/useGetStudentListByAssignmentId';
import { useUploadSubmissionMutation } from '@/hooks/useUploadSubmission';
import { getUrlImageByUploadOnCloudiary } from '@/lib/api/getUrlImageByUploadOnCloudiary';
import { saveStudentSubmission } from '@/lib/api/HomeworkSubmission/saveStudentSubmission';
import { AlertCircle, FileText, Loader2, Send, Upload, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

function AssignmentForm() {
    const { assignment_id } = useParams();
    const router = useRouter();

    const { data: assignment, isLoading: isAssignmentLoading, isError: isAssignmentError, error: assignmentError } = useGetClassHomeworkById(assignment_id as string);
    const { data: studentLists, isLoading: isStudentListsLoading, isError: isStudentListsError, error: studentListsError } = useGetStudentListByAssignmentId(assignment_id as string);

    const { showAlert } = useAlert();

    const { files, previews, handleFileChange, handleRemoveFile } = useFileImg(showAlert);
    const [selectedStudentId, setSelectedStudentId] = React.useState('');

    const uploadMutation = useUploadSubmissionMutation(
        getUrlImageByUploadOnCloudiary,
        saveStudentSubmission,
    )
    if (isAssignmentLoading || isStudentListsLoading) {
        return <LoadingState fullScreen className='bg-white' />
    }

    if (isAssignmentError || isStudentListsError) {
        return <ErrorState fullScreen className='bg-white' message={assignmentError?.message || studentListsError?.message || 'Something went wrong.'} />
    }

    //handler

    const handleSubmit = () => {
        try {
            if (!files) {
                showAlert("No files selected", "error");
                return;
            }

            uploadMutation.mutate({
                files,
                student_homework_id: assignment_id as string,
                due_date: assignment!.due_date
            }, {
                onSuccess: () => {
                    router.push(`${assignment_id}/success/${selectedStudentId}`);
                }
            })


        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border-t-8 border-blue-600">
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{assignment?.title}</h1>
                                <p className="text-blue-600 font-medium mt-1">{assignment?.class_name}</p>
                            </div>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Due: {assignment?.due_date || '--.--'}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed">
                            <p className="font-semibold text-gray-900 mb-1 flex items-center">
                                <FileText size={16} className="mr-2" /> Content:
                            </p>
                            <p
                                className="ml-4 mt-2 text-base text-gray-600 overflow-hidden max-h-[100px] relative"
                                dangerouslySetInnerHTML={{ __html: assignment?.content || '' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Submission Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <Send size={20} className="mr-2 text-blue-600" />
                        Submit Your Work
                    </h3>

                    {/* Student Identification */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <User size={18} className="mr-2 text-gray-400" />
                            Who are you? <span className="text-red-500 ml-1">*</span>
                        </label>

                        {isStudentListsLoading ? (
                            <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg"></div>
                        ) : (
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="block w-full pl-3 pr-10 py-3 text-base text-gray-700 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border shadow-sm"
                            >
                                <option value="" disabled>Select your name...</option>
                                {studentLists?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Can't find your name? Contact your teacher.
                        </p>
                    </div>

                    {/* File Upload */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <Upload size={18} className="mr-2 text-gray-400" />
                            Upload Files <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover opacity-90" />
                                    <button
                                        onClick={() => handleRemoveFile(idx)}
                                        className="absolute top-1 right-1 bg-red-500 cursor-pointer text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <AlertCircle size={14} />
                                    </button>
                                </div>
                            ))}

                            <label className="border-2 border-dashed border-blue-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors">
                                <Upload size={24} className="text-blue-400 mb-1" />
                                <span className="text-xs font-semibold text-blue-600">Add Image/PDF</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" multiple />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStudentId || files?.length === 0 || uploadMutation.isPending}
                        className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                    >
                        {uploadMutation.isPending ? (
                            <div className="flex items-center">
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Uploading...
                            </div>
                        ) : (
                            "Submit Homework"
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    Powered by Class Hub
                </p>
            </div>
        </div>
    );
}

export default AssignmentForm