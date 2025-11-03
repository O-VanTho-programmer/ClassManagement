'use client';
import CreateHomework from '@/components/CreateHomework/CreateHomework'
import { useUser } from '@/context/UserContext';
import { useParams } from 'next/navigation';
import React from 'react'

export default function CreateHomeworkPage() {

  const { hub_id } = useParams();
  const user = useUser();

  return (
    <div>
        <CreateHomework hubId={hub_id as string} currentUserId={user?.userId} />
    </div>
  )
}