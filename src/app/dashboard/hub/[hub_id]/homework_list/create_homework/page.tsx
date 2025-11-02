'use client';
import CreateHomework from '@/components/CreateHomework/CreateHomework'
import { useUser } from '@/context/UserContext';
import { useParams } from 'next/navigation';
import React from 'react'

export default function CreateHomeworkPage() {

  const { hubId } = useParams();
  const user = useUser();

  return (
    <div>
        <CreateHomework hubId={hubId as string} currentUserId={user?.id} />
    </div>
  )
}