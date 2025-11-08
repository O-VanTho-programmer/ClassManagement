// This file provides mock data for the ClassData interface.

export interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
}

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

export const mockClassListData: ClassData[] = [
    {
        id: 'cls_001',
        name: 'Advanced Algebra',
        schedule: [
            { day: 'Monday', startTime: '09:00', endTime: '11:00' },
            { day: 'Wednesday', startTime: '09:00', endTime: '11:00' }
        ],
        studentCount: 24,
        teacher: 'Mr. John Doe',
        assistant: 'Ms. Emily White',
        subject: 'Mathematics',
        tuition: '2000000',
        tuitionType: 'Monthly',
        base: 'Main Campus, Room 101',
        status: 'Active',
        startDate: '2025-09-01',
        endDate: '2026-01-15'
    },
    {
        id: 'cls_002',
        name: 'Introduction to Physics',
        schedule: [
            { day: 'Tuesday', startTime: '13:00', endTime: '15:30' }
        ],
        studentCount: 18,
        teacher: 'Mrs. Carol Ray',
        assistant: undefined, // Or just omit the property
        subject: 'Physics',
        tuition: '5500000',
        tuitionType: 'Course',
        base: 'Science Wing, Lab 3',
        status: 'Active',
        startDate: '2025-09-01',
        endDate: '2025-12-20'
    },
    {
        id: 'cls_003',
        name: 'World History: Ancient Civilizations',
        schedule: [
            { day: 'Tuesday', startTime: '10:00', endTime: '11:30' },
            { day: 'Thursday', startTime: '10:00', endTime: '11:30' }
        ],
        studentCount: 31,
        teacher: 'Dr. Alan Grant',
        assistant: 'Ms. Sarah Harding',
        subject: 'History',
        tuition: '1800000',
        tuitionType: 'Quarter',
        base: 'Online',
        status: 'Finished',
        startDate: '2025-05-10',
        endDate: '2025-08-25'
    },
    {
        id: 'cls_004',
        name: 'Organic Chemistry Prep',
        schedule: [
            { day: 'Friday', startTime: '16:00', endTime: '18:00' }
        ],
        studentCount: 12,
        teacher: 'Mr. John Doe',
        subject: 'Chemistry',
        tuition: '2500000',
        tuitionType: 'Flexible',
        base: 'Lab Building A, Room 210',
        status: 'Active',
        startDate: '2025-10-01',
        endDate: '2026-02-28'
    },
    {
        id: 'cls_005',
        name: 'English Literature 101',
        schedule: [
            { day: 'Monday', startTime: '14:00', endTime: '15:30' },
            { day: 'Thursday', startTime: '14:00', endTime: '15:30' }
        ],
        studentCount: 28,
        teacher: 'Ms. Jane Eyre',
        subject: 'English',
        tuition: '1900000',
        tuitionType: 'Monthly',
        base: 'Humanities Building, Room 305',
        status: 'Active',
        startDate: '2025-09-05',
        endDate: '2026-01-20'
    }
];