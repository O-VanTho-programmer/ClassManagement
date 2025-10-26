type StudentStatus = 'Studying' | 'Finished'

interface Student {
    id: string,
    name: string,
    birthday: string,
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
    is_finished_homework?: boolean,
    is_homework?: boolean,
    comment?: string,
    date: string,
}

type StudentWithAttendanceRecordList = Student & {
    records: AttendanceRecord[],
    total_present: number,
}