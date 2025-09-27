interface AttendanceListStudents{
    date: string,
    day: string,
    name: string,
    present: StudentAttendanceType,
    score: number,
    is_finished_homework: boolean,
    comment?: string
}