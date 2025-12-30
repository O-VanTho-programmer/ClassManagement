'use client';

import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button';
import SetAnswerKeyModal from '@/components/HomeworkSubmission/SetAnswerKeyModal';
import SubmissionDetailsModal from '@/components/HomeworkSubmission/SubmissionDetailsModal';
import TableDetailStudentSubmissions from '@/components/HomeworkSubmission/TableDetailStudentSubmissions';
import TableStudentSubmissions from '@/components/HomeworkSubmission/TableStudentSubmissions';
import UploadAnswerModal from '@/components/HomeworkSubmission/UploadAnswerModal';
import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import ToggleViewClassList from '@/components/ToggleViewClassList/ToggleViewClassList';
import { useGetHomeworkById } from '@/hooks/useGetHomeworkById';
import { useGetStudentHomeworkQuestionByClassHomeworkId } from '@/hooks/useGetStudentHomeworkQuestionByStudentHomeworkId';
import { useGetStudentListByAssignmentId } from '@/hooks/useGetStudentListByAssignmentId';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useUploadSubmissionMutation } from '@/hooks/useUploadSubmission';
import { getUrlImageByUploadOnCloudiary } from '@/lib/api/getUrlImageByUploadOnCloudiary';
import { saveAnswerKey } from '@/lib/api/HomeworkSubmission/saveAnswerKey';
import { saveGrade } from '@/lib/api/HomeworkSubmission/saveGrade';
import { saveStudentSubmission } from '@/lib/api/HomeworkSubmission/saveStudentSubmission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileQuestionMarkIcon, Key } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function HomeworkSubmissionPage() {

  const { showAlert } = useAlert();
  const { homework_id, assignment_id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: homeworkData, isLoading: isHomeworkLoading, isError: isHomeworkError, error: homeworkError } = useGetHomeworkById(homework_id as string);
  const { data: studentSubmissionsList = [] as StudentWithHomework[], isLoading: isStudentSubmissionsListLoading, isError: isStudentSubmissionsListError, error: studentSubmissionsListError } = useGetStudentListByAssignmentId(assignment_id as string);
  const { data: studentHomeworkQuestion, isLoading: isStudentHomeworkQuestionLoading, isError: isStudentHomeworkQuestionError, error: studentHomeworkQuestionError } = useGetStudentHomeworkQuestionByClassHomeworkId(assignment_id as string);

  const [isKeyModalOpen, setKeyModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isGradingModalOpen, setGradingModalOpen] = useState(false);

  const [answerKey, setAnswerKey] = useState<string>(homeworkData?.answer_key || '');

  useEffect(() => {
    setAnswerKey(homeworkData?.answer_key || '');
  }, [homeworkData])

  const [viewListSubmission, setViewListSubmission] = useState<boolean>(true);

  // --- Mutations ---
  const saveKeyMutation = useMutation({
    mutationFn: (newKey: string) => saveAnswerKey(homework_id as string, newKey),
    onSuccess: (savedKey) => {
      setAnswerKey(savedKey);
      showAlert("Answer key saved successfully", 'success');
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
        showAlert("Grade saved successfully", 'success');
        setGradingModalOpen(false);
      } else {
        alert('Error saving grade');
      }
    }
  });

  // --- Permissons ---

  const { hub_id } = useParams();
  const {hasPermission: canGradeHomework} = useHasPermission(hub_id as string, 'GRADE_HOMEWORK');
  const {hasPermission: canSetKeyAnswerHomework} = useHasPermission(hub_id as string, 'SET_KEY_ANSWER_HOMEWORK');
  

  // --- Handlers ---

  const handleOpenUpload = (submission: StudentWithHomework) => {
    setSelectedSubmission(submission);
    setUploadModalOpen(true);
  };

  const handleOpenGrader = (submission: StudentWithHomework) => {
    if(!canGradeHomework){
      showAlert("You don't have permission to grade homework", 'error');
      return;
    }

    setSelectedSubmission(submission);
    setGradingModalOpen(true);

    const studentHomeworkQuestionBreakdown = studentHomeworkQuestion?.students_homework_questions.find((shq) => shq.student_id === submission.id)
    setSelectedStudentHomeworkQuestion(studentHomeworkQuestionBreakdown || null);
  };

  const handleOpenSetKeyModal = () => {
    if (!canSetKeyAnswerHomework) {
      showAlert("You don't have permission to set answer key", 'error');
      return;
    }
    setKeyModalOpen(true);
  };

  const [selectedSubmission, setSelectedSubmission] = useState<StudentWithHomework | null>(null);
  const [selectedStudentHomeworkQuestion, setSelectedStudentHomeworkQuestion] = useState<StudentHomeworkQuestions | null>(null);

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
          onClick={() => handleOpenSetKeyModal}
          className="cursor-pointer flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors"
        >
          <Key size={16} className="mr-2" />
          {answerKey ? "Edit Answer Key" : "Set Answer Key"}
        </button>
        <Button color='blue' onClick={() => { router.push(`/public/form/${assignment_id}`) }} style='w-fit h-fit' icon={FileQuestionMarkIcon} title='Copy Form' />
      </div>


      <div className='flex justify-end mt-6'>
        <ToggleViewClassList isTableView={viewListSubmission} setIsTableView={setViewListSubmission} />
      </div>

      <div className="mt-2 bg-white shadow-lg">
        {viewListSubmission ? (
          <TableStudentSubmissions
            studentSubmissionsList={studentSubmissionsList}
            handleOpenUpload={handleOpenUpload}
            handleOpenGrader={handleOpenGrader} />
        ) : (
          <TableDetailStudentSubmissions
            studentSubmissionsList={studentSubmissionsList}
            handleOpenGrader={handleOpenGrader}
            isLoading={isStudentHomeworkQuestionLoading}
            isError={isStudentHomeworkQuestionError}
            error={studentHomeworkQuestionError?.message}
            total_question={studentHomeworkQuestion?.total_question || 5}
            students_homework_questions={studentHomeworkQuestion?.students_homework_questions || []}
            answerKey={answerKey}
            class_homework_id={assignment_id as string}
          />
        )}
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
          onClose={() => { setGradingModalOpen(false); setSelectedSubmission(null); setSelectedStudentHomeworkQuestion(null) }}
          submission={selectedSubmission}
          studentQuestionBreakdown={selectedStudentHomeworkQuestion?.questions || []}
          answerKey={answerKey}
          onSaveGrade={(grade, feedback) => saveGradeMutation.mutate({ grade, feedback })}
          isSaving={saveGradeMutation.isPending}
        />
      )}
    </div>
  );

}

export default HomeworkSubmissionPage