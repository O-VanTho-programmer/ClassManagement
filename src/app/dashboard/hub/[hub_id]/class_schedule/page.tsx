'use client';

import { useGetClassesByHubIdQuery } from '@/hooks/useGetClassesByHubIdQuery';
import CalendarSchedule from '@/components/CalendarSchedule/CalendarSchedule'
import React from 'react'
import { useParams } from 'next/navigation';
import LoadingState from '@/components/QueryState/LoadingState';
import ErrorState from '@/components/QueryState/ErrorState';

export default function ClassSchedulePage() {
  const { hub_id } = useParams();
  const { data: classList = [], isLoading: isLoadingClassList, isError: isErrorClassList, error: errorClassList } = useGetClassesByHubIdQuery(hub_id as string);

  if (isLoadingClassList) return <LoadingState fullScreen message="Loading your class..." />;
  if (isErrorClassList) return (
    <ErrorState
      fullScreen
      title="Error Loading Class"
      message={errorClassList?.message || "Something went wrong while loading your class. Please try again."}
      onRetry={() => window.location.reload()}
    />
  );

  return (
    <div>
      <CalendarSchedule onEventClick={(event) => console.log(event)} classes={classList} />
    </div>
  )
}