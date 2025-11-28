'use client';

import Button from '@/components/Button/Button';
import SetAnswerKeyModal from '@/components/HomeworkSubmission/SetAnswerKeyModal';
import SubmissionDetailsModal from '@/components/HomeworkSubmission/SubmissionDetailsModal';
import UploadAnswerModal from '@/components/HomeworkSubmission/UploadAnswerModal';
import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import { useGetHomeworkById } from '@/hooks/useGetHomeworkById';
import { useGetStudentListByAssignmentId } from '@/hooks/useGetStudentListByAssignmentId';
import { useUploadSubmissionMutation } from '@/hooks/useUploadSubmission';
import { getUrlImageByUploadOnCloudiary } from '@/lib/api/getUrlImageByUploadOnCloudiary';
import { saveAnswerKey } from '@/lib/api/HomeworkSubmission/saveAnswerKey';
import { saveGrade } from '@/lib/api/HomeworkSubmission/saveGrade';
import { saveStudentSubmission } from '@/lib/api/HomeworkSubmission/saveStudentSubmission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Edit, FileQuestionMarkIcon, Key, Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function HomeworkSubmissionPage() {

  const { homework_id, assignment_id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: homeworkData, isLoading: isHomeworkLoading, isError: isHomeworkError, error: homeworkError } = useGetHomeworkById(homework_id as string);
  const { data: studentSubmissionsList = [] as StudentWithHomework[], isLoading: isStudentSubmissionsListLoading, isError: isStudentSubmissionsListError, error: studentSubmissionsListError } = useGetStudentListByAssignmentId(assignment_id as string);

  const [isKeyModalOpen, setKeyModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isGradingModalOpen, setGradingModalOpen] = useState(false);

  const [answerKey, setAnswerKey] = useState<string>(homeworkData?.answer_key || '');

  useEffect(() => {
    setAnswerKey(homeworkData?.answer_key || '');
  }, [homeworkData])

  // --- Mutations ---
  const saveKeyMutation = useMutation({
    mutationFn: (newKey: string) => saveAnswerKey(homework_id as string, newKey),
    onSuccess: (savedKey) => {
      setAnswerKey(savedKey);
      queryClient.invalidateQueries({ queryKey: ['homework', homework_id] });
      setKeyModalOpen(false);
    },
    onError: (error: Error) => alert(`Error saving key: ${error.message}`)
  });

  const uploadMutation = useUploadSubmissionMutation(
    getUrlImageByUploadOnCloudiary, 
    saveStudentSubmission,
    ["get_student_list_by_assignment_id", assignment_id]
  )

  const saveGradeMutation = useMutation({
    mutationFn: (vars: { grade: number, feedback: string }) => saveGrade(selectedSubmission!.id, vars.grade, vars.feedback),
    onSuccess: (updatedSubmission) => {
      if (updatedSubmission) {
        queryClient.invalidateQueries({ queryKey: ['get_student_list_by_assignment_id', assignment_id] })

        setGradingModalOpen(false);
      } else {
        alert('Error saving grade');
      }
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


  if (isHomeworkLoading) return (
    <LoadingState message='Loading homework...' />
  )
  if (isHomeworkError) return (
    <ErrorState message={homeworkError.message} />
  )

  if (isStudentSubmissionsListLoading) return (
    <LoadingState message='Loading submission...' />
  )
  if (isStudentSubmissionsListError) return (
    <ErrorState message={studentSubmissionsListError.message} />
  )
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">{homeworkData?.title}</h1>
      <p
        className="ml-4 mt-2 text-base text-gray-600 overflow-hidden max-h-[150px] relative"
        dangerouslySetInnerHTML={{ __html: homeworkData?.content || '' }}
      />

      <div className='mt-4 md:flex gap-3'>
        <button
          onClick={() => setKeyModalOpen(true)}
          className="cursor-pointer flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors"
        >
          <Key size={16} className="mr-2" />
          {answerKey ? "Edit Answer Key" : "Set Answer Key"}
        </button>
        <Button color='blue' onClick={() => { router.push(`/public/form/${assignment_id}`) }} style='w-fit h-fit' icon={FileQuestionMarkIcon} title='Copy Form' />
      </div>

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
            {studentSubmissionsList && studentSubmissionsList.map(submission => {
              const isLate = submission.homework_status === 'Late';
              const isGraded = submission.is_graded;

              let badgeColor = 'bg-gray-100 text-gray-800';
              let badgeText = submission.homework_status;

              if (isGraded) {
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
                  case 'Uploaded':
                  case 'Finished':
                    badgeColor = 'bg-blue-100 text-blue-800';
                    badgeText = 'Submitted';
                    break;
                  case 'Overdue':
                    badgeColor = 'bg-orange-100 text-orange-800';
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
          onUpload={(files,) => uploadMutation.mutate(
            {
              files,
              student_homework_id: selectedSubmission!.student_homework_id,
              due_date: selectedSubmission!.due_date
            })}
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