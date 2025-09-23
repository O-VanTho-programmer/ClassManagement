const getDiffTimeFromStartToNow = (date: string) => {
    const now = new Date();
    const then = new Date(date.split('/').reverse().join('-')); // Converts 'DD/MM/YYYY' to 'YYYY-MM-DD'
    const diffInMonths = now.getMonth() - then.getMonth() + (12 * (now.getFullYear() - then.getFullYear()));

    if (diffInMonths === 0) {
        return 'less than a month ago';
    } else if (diffInMonths === 1) {
        return '1 month ago';
    } else {
        return `${diffInMonths} months ago`;
    }
};

export default getDiffTimeFromStartToNow;