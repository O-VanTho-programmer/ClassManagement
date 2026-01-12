'use client';

import FaceStudentsTableList from '@/components/FaceSecurity/FaceUserTableList'
import { useGetStudentsWithFaceDescriptorByClassHomeworkId } from '@/hooks/useGetStudentsWithFaceDescriptorByClassHomeworkId';
import { useParams } from 'next/navigation';
import React from 'react'

export default function SecuritySetting() {
  const { assignment_id } = useParams();
  const { data: students } = useGetStudentsWithFaceDescriptorByClassHomeworkId(assignment_id as string);
  return (
    <div>
      <FaceStudentsTableList students={students || []} assignmentId={assignment_id as string} />
    </div>
  )
}