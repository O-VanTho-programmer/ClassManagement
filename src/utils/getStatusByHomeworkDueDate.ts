const getStatusByHomeworkDueDate = (dueDateStr: string): { text: string; color: string } => {
    const today = new Date();
    // We add T00:00:00 to ensure it's parsed as local time, not UTC
    const dueDate = new Date(`${dueDateStr}T00:00:00`);

    // Normalize dates to midnight to compare just the day
    today.setHours(0, 0, 0, 0);
    // Note: dueDate is already at midnight

    if (dueDate.getTime() < today.getTime()) {
        return { text: 'Past Due', color: 'bg-red-100 text-red-800' };
    }
    if (dueDate.getTime() === today.getTime()) {
        return { text: 'Due Today', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'Upcoming', color: 'bg-green-100 text-green-800' };
};

export default getStatusByHomeworkDueDate;