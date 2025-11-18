export async function saveStudentSubmission(studentId: string, homeworkId: string, submissionDataUrl: string): Promise<StudentWithHomework> {
    console.log(`[API MOCK] Saving submission for student ${studentId}`);
    await new Promise(r => setTimeout(r, 1000));
    return {
        id: studentId,
        name: 'Mock Student',
        birthday: null,
        status: 'Studying',
        student_homework_id: `sh_${studentId}`,
        homework_status: 'Uploaded',
        submission_data: submissionDataUrl,
        submitted_date: new Date().toISOString(),
        assigned_date: '',
        due_date: '',
        grade: 0
    };
};