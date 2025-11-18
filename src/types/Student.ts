type StudentStatus = 'Studying' | 'Finished'

interface Student {
    id: string,
    name: string,
    birthday: string | null,
    status: StudentStatus,
}

interface StudentWithEnrollment extends Student {
    enroll_date: string,
}

interface StudentInputDto {
    name: string,
    birthday: string,
}

interface ClassEnrollmentDto {
    classId: string,
    enrollDate: string,
}

type StudentAttendanceType = 'Present' | 'Late' | 'Excused' | 'Absent' | 'Unchecked'

type StudentAttendance = AttendanceRecord & {
    id: string,
    name: string,
}

interface AttendanceRecord {
    present: StudentAttendanceType,
    score?: number,
    assignments?: ClassHomeworkForAttendacneRecord[],
    is_homework?: boolean,
    comment?: string,
    date: string,
}

type StudentWithAttendanceRecordList = Student & {
    records: AttendanceRecord[],
    total_present: number,
}

type StudentWithHomework = Student & {
    student_homework_id: string,
    homework_status: string,
    submission_data?: string,
    submitted_date: string,
    assigned_date: string,
    due_date: string,
    grade: number | 0,
    feedback? : string
}