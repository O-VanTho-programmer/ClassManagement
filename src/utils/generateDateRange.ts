import { dayMap } from "./calculateScheduledDays";

const generateDateRange = (startDateStr: string, endDateStr: string, schedule: { day: string; time: string; }[]): string[] => {
    // Robustly create local date objects by ensuring time components are 00:00:00 locally
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0); // Set to midnight local time

    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999); // Set to end of day local time

    // Convert Vietnamese day names to JS getDay() indices (0-6)
    // Based on the provided schedule (Thứ 3 & Thứ 5), this should result in [2, 4]
    const scheduledDays = schedule.map(s => dayMap[s.day]).filter(day => day !== undefined);

    const dates: string[] = [];
    let current = start;

    while (current <= end) {
        const dayOfWeek = current.getDay(); // 0 for Sunday, 1 for Monday...

        if (scheduledDays.includes(dayOfWeek)) {
            const dateString = current.toISOString().split('T')[0];
            dates.push(dateString);
        }

        current.setDate(current.getDate() + 1);
    }

    return dates;
};

export default generateDateRange;