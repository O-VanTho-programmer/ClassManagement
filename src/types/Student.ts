type StudentStatus = 'Studying' | 'Finished'

interface Student{
    name: string,
    birthday: string,
    enroll_date: string,
    status: StudentStatus,
}

type StudentAttendanceType = 'present' | 'late' | 'excused' | 'absent'

interface StudentAttendance{
    id: string,
    name: string,
    present: StudentAttendanceType,
    score: number,
    is_finished_homework?: boolean,
    comment?: string,
    date: string,
}