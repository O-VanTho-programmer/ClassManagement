import type { Schedule } from "./Schedule";

export interface ClassData extends ClassDataSimple{
    schedule: Schedule[];
    studentCount: number;
    teacher: string;
    assistant?: string;
    subject: string;
    tuition?: string;
    tuitionType: "Monthly" | "Quarter" | "Course" | "Flexible",
    base?: string;
    startDate: string;
    endDate: string;
}

export interface ClassDataSimple {
    id: string;
    name: string;
    status: 'Active' | 'Finished';
}

export interface ClassDataWithTimeTableHour {
    class: ClassData,
    session: Schedule;
    start_hour: number;
}