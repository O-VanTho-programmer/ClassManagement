export const getCategoryPermissions = (code: string) => {
    if (code.includes('CLASS')) return 'Class Management';
    if (code.includes('STUDENT')) return 'Student Management';
    if (code.includes('HOMEWORK')) return 'Homework & Assignments';
    if (code.includes('ATTENDANCE')) return 'Attendance';
    if (code.includes('MEMBER')) return 'Admin & Settings';
    return 'Other';
};