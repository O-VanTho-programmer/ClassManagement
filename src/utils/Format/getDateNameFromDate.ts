const getDayNameFromDate = (dateString: string): string => {
    // Note: Parsing YYYY-MM-DD strings often defaults to UTC midnight, 
    // which prevents time zone shifts from changing the day in the current locale.
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    // Use 'en-US' locale with 'long' format for the full day name
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export default getDayNameFromDate;