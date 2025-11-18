import { Schedule } from "@/types/Schedule";
import { dayMap } from "./calculateScheduledDays";

const generateDateRange = (startDateStr: string, endDateStr: string, schedule: Schedule[]): string[] => {
    // Robustly create local date objects by ensuring time components are 00:00:00 locally
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0); // Set to midnight local time

    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999); // Set to end of day local time

    const scheduledDays = schedule.map(s => dayMap[s.day]).filter(day => day !== undefined);

    const dates: string[] = [];
    const current = start;

    while (current <= end) {
        const dayOfWeek = current.getDay(); // 0 for Sunday, 1 for Monday...
        // console.log(dayOfWeek)

        if (scheduledDays.includes(dayOfWeek)) {
            // console.log(dayOfWeek)
            const dateString = current.toLocaleDateString('vn-VN').split('T')[0];
            dates.push(dateString);
        }

        current.setDate(current.getDate() + 1);
    }

    // console.log(dates)
    return dates;
};

export default generateDateRange;