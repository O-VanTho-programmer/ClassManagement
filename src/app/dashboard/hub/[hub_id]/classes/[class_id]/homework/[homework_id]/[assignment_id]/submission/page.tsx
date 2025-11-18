'use client';

import SetAnswerKeyModal from '@/components/HomeworkSubmission/SetAnswerKeyModal';
import SubmissionDetailsModal from '@/components/HomeworkSubmission/SubmissionDetailsModal';
import UploadAnswerModal from '@/components/HomeworkSubmission/UploadAnswerModal';
import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useGetHomeworkById } from '@/hooks/useGetHomeworkById';
import { useGetStudentListByAssignmentId } from '@/hooks/useGetStudentListByAssignmentId';
import { saveAnswerKey } from '@/lib/api/HomeworkSubmission/saveAnswerKey';
import { saveGrade } from '@/lib/api/HomeworkSubmission/saveGrade';
import { saveStudentSubmission } from '@/lib/api/HomeworkSubmission/saveStudentSubmission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Edit, Key, Upload } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function HomeworkSubmissionPage() {

  const { homework_id, assignment_id } = useParams();
  const queryClient = useQueryClient();

  const { data: homeworkData } = useGetHomeworkById(homework_id as string);
  const { data: studentSubmissionsList = [] as StudentWithHomework[], isLoading: isStudentSubmissionsListLoading, isError: isStudentSubmissionsListError, error: studentSubmissionsListError } = useGetStudentListByAssignmentId(assignment_id as string);

  const [isKeyModalOpen, setKeyModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isGradingModalOpen, setGradingModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Local state for the answer key
  const [answerKey, setAnswerKey] = useState('');

  // --- Mutations ---
  const saveKeyMutation = useMutation({
    mutationFn: (newKey: string) => saveAnswerKey(homework_id as string, newKey),
    onSuccess: (savedKey) => {
      setAnswerKey(savedKey); // Update local state
      queryClient.invalidateQueries({ queryKey: ['homework', homework_id] });
      setKeyModalOpen(false);
    },
    onError: (error: Error) => alert(`Error saving key: ${error.message}`)
  });

  const uploadMutation = useMutation({
    mutationFn: (dataUrl: string) => saveStudentSubmission(selectedSubmission!.id, homework_id as string, dataUrl),
    onSuccess: (newSubmission) => {
      // Manually update the query cache to reflect the new 'Uploaded' status
      queryClient.setQueryData(['studentSubmissions', assignment_id], (oldData: any) => {
        return oldData.map((sub: StudentWithHomework) =>
          sub.id === newSubmission.id ? { ...sub, ...newSubmission } : sub
        );
      });
      setUploadModalOpen(false);
    }
  });

  const saveGradeMutation = useMutation({
    mutationFn: (vars: { grade: number, feedback: string }) =>
      saveGrade(selectedSubmission!.id, homework_id as string, vars.grade, vars.feedback),
    onSuccess: (updatedSubmission) => {
      // Manually update cache
      queryClient.setQueryData(['studentSubmissions', assignment_id], (oldData: any) => {
        return oldData.map((sub: StudentWithHomework) =>
          sub.id === updatedSubmission.id ? { ...sub, ...updatedSubmission } : sub
        );
      });
      setGradingModalOpen(false);
    }
  });

  // --- Handlers ---

  const handleOpenUpload = (submission: StudentWithHomework) => {
    setSelectedSubmission(submission);
    setUploadModalOpen(true);
  };

  const handleOpenGrader = (submission: StudentWithHomework) => {
    setSelectedSubmission(submission);
    setGradingModalOpen(true);
  };

  const [selectedSubmission, setSelectedSubmission] = useState<StudentWithHomework | null>(null);

  if (isStudentSubmissionsListLoading) return (
    <LoadingState message='Loading submission...' />
  )
  if (isStudentSubmissionsListError) return (
    <ErrorState message={studentSubmissionsListError.message} />
  )
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">{homeworkData?.title}</h1>
      <p className="text-lg text-gray-600 mt-1">{homeworkData?.content}</p>

      <button
        onClick={() => setKeyModalOpen(true)}
        className="mt-4 cursor-pointer flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors"
      >
        <Key size={16} className="mr-2" />
        {answerKey ? "Edit Answer Key" : "Set Answer Key"}
      </button>

      <div className="mt-8 bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentSubmissionsList && studentSubmissionsList.map(submission => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${submission.homework_status === 'Graded' ? 'bg-green-100 text-green-800' :
                    submission.homework_status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                      submission.homework_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {submission.homework_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {submission.grade ? `${submission.grade}%` : '--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenUpload(submission)}
                    className="text-gray-600 hover:text-blue-700 cursor-pointer"
                    title="Upload Submission"
                  >
                    <Upload size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenGrader(submission)}
                    disabled={!submission.submission_data}
                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed"
                    title="Grade Submission"
                  >
                    {submission.homework_status === 'Graded' || submission.homework_status === 'Submitted' ? <Edit size={18} /> : <CheckCircle size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SetAnswerKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        initialKey={answerKey}
        onSave={(newKey) => saveKeyMutation.mutate(newKey)}
        isSaving={saveKeyMutation.isPending}
      />

      {selectedSubmission && (
        <UploadAnswerModal
          isOpen={isUploadModalOpen}
          onClose={() => { setUploadModalOpen(false); setSelectedSubmission(null); }} 
          studentName={selectedSubmission.name} 
          onUpload={(dataUrl) => uploadMutation.mutate(dataUrl)}
          isUploading={uploadMutation.isPending}
        />
      )}
      {selectedSubmission && (
        <SubmissionDetailsModal
          isOpen={isGradingModalOpen}
          onClose={() => { setGradingModalOpen(false); setSelectedSubmission(null); }} 
          submission={selectedSubmission}
          answerKey={answerKey}
          onSaveGrade={(grade, feedback) => saveGradeMutation.mutate({ grade, feedback })}
          isSaving={saveGradeMutation.isPending} 
        />
      )}
    </div>
  );

}

export default HomeworkSubmissionPage