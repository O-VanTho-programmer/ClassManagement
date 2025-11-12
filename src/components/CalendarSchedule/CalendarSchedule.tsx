import { ClassData } from "@/types/ClassData";
import { dayNames } from "@/utils/dayNames";
import getStartSundayOfWeek from "@/utils/getStartSundayOfWeek";
import getWeekDays from "@/utils/getWeekDays";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

type CalendarScheduleProps = {
    classes: ClassData[];
    onEventClick: (classData: ClassData) => void;
    isLoading?: boolean;
}

interface ProcessedEvent {
    event: ClassData;
    session: ClassData['schedule'][0];
    rowSpan: number;
}

const startHour = 7; // 7AM
const endHour = 20; // 8 PM

//  Generates an array of 30-minute time slots (e.g., "07:00", "07:30", ... "20:00") 
const generate30MinTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let h = startHour; h <= endHour; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < endHour) { // Don't add a "20:30" slot
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
};

const add30Minutes = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    if (minute === 30) {
        return `${(hour + 1).toString().padStart(2, '0')}:00`;
    }
    return `${hour.toString().padStart(2, '0')}:30`;
};

const timeToGridRow = (time: string): number => {
    if (typeof time !== 'string' || !time.includes(':')) return 1;
    const [hour, minute] = time.split(':').map(Number);
    const hoursFromStart = hour - startHour;
    const minutesFromStart = (hoursFromStart * 60) + minute;
    return (minutesFromStart / 30) + 1;
};

const dayToGridCol = (day: string): number | null => {
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day.trim());
    if (dayIndex === -1) return null;
    return dayIndex; // 0-indexed for array
};

const formatHeaderDate = (date: Date): { day: string, date: string } => {
    return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
};

const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};


export default function CalendarSchedule({
    classes = [],
    onEventClick,
    isLoading = false
}: CalendarScheduleProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfWeek = getStartSundayOfWeek(currentDate);
    const weekDays = getWeekDays(startOfWeek);
    const today = new Date();

    // Generate the time slots for the <tbody> rows
    const timeSlots30Min = useMemo(() => generate30MinTimeSlots(), []);

    const goToPreviousWeek = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    };

    const goToNextWeek = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    };

    const { eventsMap, coveredSlots } = useMemo(() => {
        const eventsMap = new Map<string, ProcessedEvent>();
        const coveredSlots = new Set<string>();

        for (const cls of classes) {
            if (!Array.isArray(cls.schedule)) continue;

            for (const session of cls.schedule) {
                const day = session.day.trim();
                const rowStart = timeToGridRow(session.startTime);
                const rowEnd = timeToGridRow(session.endTime);

                // Calculate duration in 30-min blocks
                const rowSpan = rowEnd - rowStart;

                if (rowSpan <= 0) continue;

                const eventKey = `${day}-${session.startTime}`;
                eventsMap.set(eventKey, { event: cls, session, rowSpan });

                // Add all covered slots to the Set
                let currentTime = session.startTime;
                for (let i = 0; i < rowSpan - 1; i++) {
                    currentTime = add30Minutes(currentTime);
                    coveredSlots.add(`${day}-${currentTime}`);
                }
            }
        }
        return { eventsMap, coveredSlots };
    }, [classes]);



    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Header: Navigation and Current Week */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    My Weekly Schedule
                </h2>
                <div className="flex items-center space-x-2">
                    <button onClick={goToPreviousWeek} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-48 text-center">
                        {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        {' - '}
                        {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={goToNextWeek} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Table */}
            <div className="overflow-x-auto relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-30">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                    </div>
                )}
                <table className="min-w-full border-collapse border border-gray-200">
                    {/* Table Head (Days) */}
                    <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                            <th className="w-20 border-r border-gray-200 p-2"></th>
                            {weekDays.map(date => {
                                const { day } = formatHeaderDate(date);
                                const isToday = isSameDay(date, today);
                                return (
                                    <th
                                        key={date.toISOString()}
                                        className={`p-2 text-center border-b border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                                    >
                                        <span className="text-xs font-medium text-gray-500">{day}</span>
                                        <span
                                            className={`block text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}
                                        >
                                            {date.getDate()}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    {/* Table Body (Time Slots) */}
                    <tbody>
                        {timeSlots30Min.map(time => {
                            const isFullHour = time.endsWith(':00');
                            return (
                                <tr key={time} className="h-[30px]">
                                    {/* Time Label Column */}
                                    <td className={`p-0 align-top border-r border-gray-200 ${isFullHour ? 'border-t' : ''}`}>
                                        {isFullHour && (
                                            <span className="text-xs text-gray-400 relative top-0 right-2 float-right">{time}</span>
                                        )}
                                    </td>

                                    {/* Day Columns */}
                                    {dayNames.map(day => {
                                        const eventKey = `${day}-${time}`;

                                        // Case 1: An event STARTS in this slot
                                        if (eventsMap.has(eventKey)) {
                                            const { event, session, rowSpan } = eventsMap.get(eventKey)!;
                                            return (
                                                <td
                                                    key={eventKey}
                                                    rowSpan={rowSpan}
                                                    className={`border border-blue-200 bg-blue-50 p-0 m-0 align-top`}
                                                >
                                                    <button
                                                        onClick={() => onEventClick(event)}
                                                        className="w-full h-full text-left p-2 overflow-hidden bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-800 rounded-lg shadow-sm"
                                                    >
                                                        <p className="text-xs font-bold truncate">{event.name}</p>
                                                        <p className="text-xs truncate">{session.startTime} - {session.endTime}</p>
                                                    </button>
                                                </td>
                                            );
                                        }

                                        // Case 2: This slot is COVERED by a rowspan
                                        if (coveredSlots.has(eventKey)) {
                                            return null; // This <td> is skipped
                                        }

                                        // Case 3: Empty slot
                                        return (
                                            <td key={eventKey} className={`border ${isFullHour ? 'border-t-gray-200' : 'border-t-transparent'} border-b-transparent border-r-gray-200 border-l-gray-200`}></td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}