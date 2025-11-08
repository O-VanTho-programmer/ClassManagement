'use client';

import CalendarSchedule from '@/components/CalendarSchedule/CalendarSchedule'
import { mockClassListData } from '@/data_sample/classDataMock';
import React from 'react'

export default function ClassSchedulePage() {
  return (
    <div>
        <CalendarSchedule onEventClick={(event) => console.log(event)} classes={mockClassListData}/>
    </div>
  )
}