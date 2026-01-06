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
    submission_urls?: ResultUpload[],
    submitted_date: string,
    assigned_date: string,
    due_date: string,
    is_graded: boolean,
    grade: number | 0,
    feedback?: string,
}

type StudentWithHomeworkPublic = Student & {
    student_homework_id: string;
    homework_status: string;
    submission_urls: ResultUpload[];
    submitted_date: string;
    is_graded: boolean;
}

type StudentHomeworkQuestion = StudentHomeworkQuestionsInputDTO & {
    student_homework_question_id: string,
}

type StudentHomeworkQuestions = {
    student_id: string,
    student_name: string,
    student_homework_id: string,
    total_score: number | null,
    homework_status: string,
    feedback: string | null,
    questions: StudentHomeworkQuestion[]; //ith question, grade of ith question
}

type StudentHomeworkQuestionsInputDTO = {
    question_number: number,
    grade: number,
    max_grade: number,
    feed_back: string,
}

type StudentHomeworkQuestionResponseDTO = {
    total_question: number,
    students_homework_question: StudentHomeworkQuestions[],
}