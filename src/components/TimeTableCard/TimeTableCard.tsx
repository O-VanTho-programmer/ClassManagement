import { ClassDataWithTimeTableHour } from "@/types/ClassData";
import { Moon, Sun } from "lucide-react";
import React from "react";
import ClassCardTimeTable from "../ClassCardTimeTable/ClassCardTimeTable";

type TimeTableCardProps = {
    timeSchedule: 'Morning' | 'Afternoon';
    classes: ClassDataWithTimeTableHour[];
}

const Icons = {
    'Morning': <Sun />,
    'Afternoon': <Moon />,
}

const times = {
    'Morning': {
        timeLable: '6:00 - 11:00',
        timeList: [6, 7, 8, 9, 10, 11]
    },
    'Afternoon': {
        timeLable: '12:00 - 17:00',
        timeList: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    },
}

export default function TimeTableCard({
    timeSchedule = 'Morning',
    classes = [] 
}: TimeTableCardProps) {
    const timeLable = times[timeSchedule].timeLable;
    const timeList = times[timeSchedule].timeList;
    const selectedIcon = Icons[timeSchedule];

    console.log(classes)

    return (
        <div className="p-4 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className='flex items-center text-lg font-bold text-gray-700 mb-4 p-2'>
                {React.cloneElement(selectedIcon, {
                    className: `mr-2 ${timeSchedule === 'Morning' ? 'text-yellow-500' : 'text-indigo-500'}`
                })}
                <span>{timeSchedule}</span>
                <span className="ml-2 font-normal text-sm text-gray-500">({timeLable})</span>
            </div>

            <div className="relative">
                <div className="absolute left-6 w-0.5 h-full bg-gray-200 -z-10"></div>

                {timeList.map((hour) => {
                    const classesInThisHour = classes.filter(
                        item => item.start_hour === hour
                    );
                    const classCount = classesInThisHour.length;

                    return (
                        <div key={hour} className="relative py-4">
                            {/* Time Header */}
                            <div className="flex items-center mb-1">
                                <span className="z-10 bg-white pr-3 text-lg font-semibold text-gray-800">
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${classCount > 0 ? 'bg-pink-100 text-pink-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {classCount} lớp
                                </span>
                            </div>

                            {/* Content Area */}
                            <div className="p-2 pl-6">
                                {classCount > 0 ? (
                                    <div className="space-y-2">
                                        {classesInThisHour.map(item => (
                                            <ClassCardTimeTable
                                                key={`${item.class.id}-${item.session.day}-${item.start_hour}`}
                                                classData={item.class}
                                                session={item.session}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-20 flex items-center justify-center text-gray-400">
                                        Không có lớp học
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
