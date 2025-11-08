import { ClassData, ClassDataWithTimeTableHour } from '@/types/ClassData'
import { Calendar } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import DatePicker from '../DatePicker/DatePicker';
import Button from '../Button/Button';
import TimeTableCard from '../TimeTableCard/TimeTableCard';
import { mockClassListData } from '@/data_sample/classDataMock';
import { dayNames } from '@/utils/dayNames';
import formatDateForCompare from '@/utils/Format/formatDateForCompare';
import formatDate from '@/utils/Format/formatDate';

type TimeTableProps = {
    classDatas: ClassData[];
}

export default function TimeTable({ classDatas = [] }: TimeTableProps) {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleSelectTodayDate = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    }

    const filterClasses = useMemo(() => {
        const date = new Date(selectedDate + "T00:00:00");
        const selectedDayName = dayNames[date.getDay()];
        const formatSelectedDate = formatDateForCompare(selectedDate);

        return classDatas.flatMap(cls => {
            const isDateValid = formatDateForCompare(cls.startDate) <= formatSelectedDate && formatDateForCompare(cls.endDate) >= formatSelectedDate

            if (!isDateValid) {
                return [];
            }

            const validSessions = cls.schedule.filter(session =>
                session.day.trim() === selectedDayName
            );

            if (validSessions.length > 0) {
                return [{
                    ...cls,
                    schedule: validSessions
                }]
            }

            return [];
        })

    }, [selectedDate, classDatas])

    console.log(filterClasses);

    const filterClassDataMorning = useMemo((): ClassDataWithTimeTableHour[] => {
        let res: ClassDataWithTimeTableHour[] = [];

        filterClasses.forEach(cls => {
            cls.schedule.forEach(session => {
                let timeStart = parseInt(session.startTime.split(':')[0]);
                let timeEnd = parseInt(session.endTime.split(':')[0]);

                if (6 <= timeStart && timeStart <= 11) {
                    let studyTime = timeEnd - timeStart;
                    let startHour = timeStart;

                    for (let i = 0; i <= studyTime; i++) {
                        res.push({
                            class: cls,
                            session: session,
                            start_hour: startHour++,
                        })
                    }
                }
            })
        })

        return res;
    }, [filterClasses]);

    const filterClassDataAfternoon = useMemo((): ClassDataWithTimeTableHour[] => {
        let res: ClassDataWithTimeTableHour[] = [];

        filterClasses.forEach(cls => {
            cls.schedule.forEach(session => {
                let timeStart = parseInt(session.startTime.split(':')[0]);
                let timeEnd = parseInt(session.endTime.split(':')[0]);

                if (6 <= timeStart && timeStart <= 11) {
                    let studyTime = timeEnd - timeStart;
                    let startHour = timeStart;

                    for (let i = 0; i <= studyTime; i++) {
                        res.push({
                            class: cls,
                            session: session,
                            start_hour: startHour++,
                        })
                    }
                }
            })
        })

        return res;
    }, [filterClasses]);

    return (
        <div>
            {/* Header */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between mb-6">
                <div className='flex items-center'>
                    <span className="bg-blue-50 text-blue-600 flex items-center justify-center w-[50px] h-[50px] ">
                        <Calendar size={30} />
                    </span>

                    <div className="ml-2">
                        <span className="text-base font-bold">Today Timetable</span>
                        <p className="flex items-center text-gray-500 font-medium">
                            {formatDate(selectedDate)}
                            <span className="mx-2">-</span>
                            {dayNames[new Date(selectedDate).getDay()]}
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <DatePicker label='' onChange={(date) => setSelectedDate(date)} date={selectedDate} />
                    <Button color='blue' title='Today' onClick={handleSelectTodayDate} />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                <TimeTableCard classes={filterClassDataMorning} timeSchedule='Morning' />
                <TimeTableCard classes={filterClassDataAfternoon} timeSchedule='Afternoon' />
            </div>
        </div>
    )
}