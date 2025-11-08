'use client';

import TimeTable from '@/components/TimeTable/TimeTable'
import { mockClassListData } from '@/data_sample/classDataMock'
import React from 'react'

export default function ClassPeriodPage() {
  return (
    <div>
      <TimeTable classDatas={mockClassListData} />
    </div>
  )
}