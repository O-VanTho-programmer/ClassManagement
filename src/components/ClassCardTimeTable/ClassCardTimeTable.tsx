import { ClassData } from '@/types/ClassData';
import { Schedule } from '@/types/Schedule';
import { Clock, User } from 'lucide-react';
import React from 'react'

type ClassCardTimeTableProps = {
  classData: ClassData;
  session: Schedule
}

export default function ClassCardTimeTable({classData, session}: ClassCardTimeTableProps) {
  return (
    <div className='border border-gray-200 rounded-lg bg-white py-3 px-4'>
        <h3 className='mb-4'>{classData.name}</h3>

        <div className='flex items-center gap-1 text-gray-500 text-sm'>
          <User size={14}/>
          {classData.teacher}
        </div>
        <div className='flex items-center gap-1 text-gray-500 text-sm'>
          <Clock size={14}/>
          {session.startTime} - {session.endTime}
        </div>
    </div>
  )
}