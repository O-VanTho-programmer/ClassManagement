export const studentAttendanceRecordsDataSample: StudentWithAttendanceRecordList[] = [
    // Học sinh 1: Nguyễn Văn An - Đang học
    {
        id: 'STD001',
        name: 'Nguyễn Văn An',
        birthday: '2010-05-15',
        enroll_date: '2025-09-01',
        status: 'Studying',
        records: [
            {
                present: 'present',
                score: 95,
                is_finished_homework: true,
                comment: 'Tập trung tốt, hoàn thành bài tập đầy đủ.',
                date: '2025-09-03', // Thứ 3
            },
            {
                present: 'present',
                score: 88,
                is_finished_homework: false,
                comment: 'Bài tập về nhà còn thiếu sót, cần cải thiện tốc độ.',
                date: '2025-10-05', 
            },
            {
                present: 'absent',
                score: 0,
                is_finished_homework: false,
                comment: 'Vắng không phép.',
                date: '2025-10-6', 
            },
            {
                present: 'late',
                score: 80,
                is_finished_homework: true,
                comment: 'Đi học muộn 15 phút, nhưng tham gia bài giảng tích cực.',
                date: '2025-10-12', 
            },
        ],
    },
    // Học sinh 2: Trần Thị Bảo Châu - Đã kết thúc khóa học
    {
        id: 'STD002',
        name: 'Trần Thị Bảo Châu',
        birthday: '2009-11-20',
        enroll_date: '2025-09-01',
        status: 'Finished',
        records: [
            {
                present: 'present',
                score: 85,
                is_finished_homework: true,
                comment: 'Tham gia đầy đủ, thái độ tốt.',
                date: '2025-10-05',
            },
            {
                present: 'excused',
                score: 0,
                is_finished_homework: true,
                comment: 'Xin nghỉ có phép vì lý do gia đình, đã nộp bài tập về nhà.',
                date: '2025-10-06', 
            },
            {
                present: 'present',
                score: 92,
                is_finished_homework: true,
                comment: 'Buổi học bù từ buổi trước, kết quả tốt.',
                date: '2025-09-10', // Thứ 3
            },
            {
                present: 'late',
                score: 75,
                is_finished_homework: false,
                comment: 'Đến muộn, bài tập về nhà chưa hoàn thành.',
                date: '2025-09-12', // Thứ 5
            },
            {
                present: 'present',
                score: 90,
                is_finished_homework: true,
                comment: 'Hoàn thành khóa học, kết quả tổng thể xuất sắc.',
                date: '2025-09-17', // Thứ 3
            },
        ],
    },
];