type StudentStatus = 'Studying' | 'Finished'

interface Student {
    id: string,
    name: string,
    birthday: string,
    enroll_date: string,
    status: StudentStatus,
}

interface StudentInputDto {
    name: string,
    birthday: string,
    enroll_date: string,
}

type StudentAttendanceType = 'present' | 'late' | 'excused' | 'absent' | 'unchecked'

type StudentAttendance = AttendanceRecord & {
    id: string,
    name: string,
}

interface AttendanceRecord {
    present: StudentAttendanceType,
    score?: number,
    is_finished_homework?: boolean,
    comment?: string,
    date: string,
}

type StudentWithAttendanceRecordList = Student & {
    records: AttendanceRecord[]
}