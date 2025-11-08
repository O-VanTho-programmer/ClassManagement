import type { Schedule } from "./Schedule";

export interface ClassData {
    id: string;
    name: string;
    schedule: Schedule[];
    studentCount: number;
    teacher: string;
    assistant?: string;
    subject: string;
    tuition?: string;
    tuitionType: "Monthly" | "Quarter" | "Course" | "Flexible",
    base?: string;
    status: 'Active' | 'Finished';
    startDate: string;
    endDate: string;
}

export interface ClassDataWithTimeTableHour {
    class: ClassData,
    session: Schedule;
    start_hour: number;
}