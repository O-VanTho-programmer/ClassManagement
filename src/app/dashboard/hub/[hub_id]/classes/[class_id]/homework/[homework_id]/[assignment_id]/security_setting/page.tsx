'use client';

import FaceStudentsTableList from '@/components/FaceSecurity/FaceUserTableList'
import { useGetAssignmentSecuritySettings } from '@/hooks/useGetAssignmentSecuritySettings';
import { useGetStudentsWithFaceDescriptorByClassHomeworkId } from '@/hooks/useGetStudentsWithFaceDescriptorByClassHomeworkId';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useMutationToggleFaceAuth } from '@/hooks/useMutationToggleFaceAuth';
import { Info, Loader2, ScanFace, ShieldCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react'

export default function SecuritySetting() {
  const { hub_id, assignment_id } = useParams();
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsWithFaceDescriptorByClassHomeworkId(assignment_id as string);
  const { data: settings, isLoading: isLoadingSettings } = useGetAssignmentSecuritySettings(assignment_id as string);

  const {hasPermission: canEditFaceAuthHomeWork} = useHasPermission(hub_id as string, 'EDIT_FACE_AUTH_HOMEWORK');

  const mutationToggleFaceAuth = useMutationToggleFaceAuth(assignment_id as string);

  const isEnabled = settings?.is_face_auth_enabled ?? false;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignment Security</h1>
                <p className="text-gray-600 leading-relaxed max-w-2xl">
                  Enhance academic integrity by enabling biometric verification.
                  When enabled, students must verify their identity using facial recognition
                  before they can access or submit this assignment.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Toggle Control */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <ScanFace size={24} className={isEnabled ? "text-green-600" : "text-gray-400"} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Require Face Verification</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Students will need to use their device camera to verify identity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {mutationToggleFaceAuth.isPending && (
                <span className="text-sm text-gray-400 flex items-center animate-pulse">
                  <Loader2 size={14} className="animate-spin mr-2" /> Saving...
                </span>
              )}

              <button
                onClick={() => mutationToggleFaceAuth.mutate(!isEnabled)}
                disabled={isLoadingSettings}
                className={`
                                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                    ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}
                                    ${isLoadingSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
              >
                <span className="sr-only">Enable Face Verification</span>
                <span
                  className={`
                                        inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300
                                        ${isEnabled ? 'translate-x-7' : 'translate-x-1'}
                                    `}
                />
              </button>
            </div>
          </div>

          {/* Status Banner */}
          {isEnabled && (
            <div className="bg-green-50 px-8 py-3 border-t border-green-100 flex items-center text-sm text-green-800 animate-in fade-in slide-in-from-top-1">
              <Info size={16} className="mr-2" />
              Security is active. Only registered students below can submit work.
            </div>
          )}
        </div>

        {/* 3. Student Registry Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-900">Student Registry</h2>
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {students?.length || 0} Students Enrolled
            </div>
          </div>

          {isLoadingStudents ? (
            <div className="p-12 flex justify-center text-indigo-600">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : (
            <FaceStudentsTableList
              students={students}
              assignmentId={assignment_id as string}
            />
          )}
        </div>
      </div>
    </div>
  )
}