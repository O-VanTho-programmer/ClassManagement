export async function saveGrade(studentId: string, homeworkId: string, grade: number, feedback: string): Promise<StudentWithHomework> {
    console.log(`[API MOCK] Saving grade ${grade} for student ${studentId}`);
    await new Promise(r => setTimeout(r, 500));
    return {
        id: studentId,
        name: 'Mock Student',
        birthday: null,
        status: 'Studying',
        student_homework_id: `sh_${studentId}`,
        homework_status: 'Graded',
        grade,
        feedback,
        submitted_date: new Date().toISOString(),
        assigned_date: '',
        due_date: '',
    };
};