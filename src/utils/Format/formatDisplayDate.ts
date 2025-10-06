// Converts 'YYYY-MM-DD' to 'DD/MM'
const formatDisplayDate = (dateString: string): string => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
    }
    return dateString;
};

export default formatDisplayDate;