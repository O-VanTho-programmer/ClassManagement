interface ClassData {
    id: string;
    name: string;
    schedule: { day: string; time: string; }[];
    studentCount: number;
    teacher: string;
    assistant?: string;
    subject: string;
    tuition?: string;
    tuitionType: "Monthly" | "Quarter" | "Course" | "Flexible",
    base?: string;
    status: 'active' | 'finished';
    startDate: string;
    endDate: string;
}