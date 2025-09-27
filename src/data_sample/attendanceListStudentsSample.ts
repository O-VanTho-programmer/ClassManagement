export const attendanceListStudentsSample : AttendanceListStudents[] = [
    // Scenario 1: Present, High Score, Homework Done
    {
        date: '2025-09-25',
        day: 'Wednesday',
        name: 'Nguyễn Văn A',
        present: 'present',
        score: 98,
        is_finished_homework: true,
    },
    // Scenario 2: Excused, Moderate Score, Homework Pending, Comment provided
    {
        date: '2025-09-25',
        day: 'Wednesday',
        name: 'Lê Thị B',
        present: 'excused',
        score: 85,
        is_finished_homework: false,
        comment: 'Nghỉ ốm (có giấy xác nhận).',
    },
    // Scenario 3: Absent, Zero Score, Homework Pending, Comment provided
    {
        date: '2025-09-25',
        day: 'Wednesday',
        name: 'Trần Văn C',
        present: 'absent',
        score: 0,
        is_finished_homework: false,
        comment: 'Không có thông báo từ phụ huynh.',
    },
    // Scenario 4: Present, Perfect Score, Homework Done
    {
        date: '2025-09-25',
        day: 'Wednesday',
        name: 'Phạm Thu D',
        present: 'present',
        score: 100,
        is_finished_homework: true,
    },
];