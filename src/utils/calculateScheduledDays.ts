import { Schedule } from "@/types/Schedule";

export default function calculateScheduledDays(
  schedule: Schedule[],
  startDate: string,
  endDate: string
): number {
  dayMap

  const scheduledDays = schedule.map(item => dayMap[item.day]);

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Total days between start and end (inclusive)
  const totalDays =
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const fullWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Base count: each scheduled day occurs once per week
  let count = fullWeeks * scheduledDays.length;

  // Handle leftover days
  for (let i = 0; i < remainingDays; i++) {
    const currentDay = (start.getDay() + i) % 7;
    if (scheduledDays.includes(currentDay)) {
      count++;
    }
  }

  return count;
}

export const dayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};