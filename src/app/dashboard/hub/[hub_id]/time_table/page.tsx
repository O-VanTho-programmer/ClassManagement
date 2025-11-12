'use client';

import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import TimeTable from '@/components/TimeTable/TimeTable'
import { mockClassListData } from '@/data_sample/classDataMock'
import { useGetClassesByHubIdQuery } from '@/hooks/useGetClassesByHubIdQuery';
import { useParams } from 'next/navigation';
import React from 'react'

export default function ClassPeriodPage() {
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
      <TimeTable classDatas={classList} />
    </div>
  )
}