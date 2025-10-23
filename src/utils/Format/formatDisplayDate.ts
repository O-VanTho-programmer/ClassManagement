// Converts 'YYYY-MM-DD' to 'DD/MM'
const formatDisplayDate = (dateString: string): string => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[1]}/${parts[0]}`;
    }
    return dateString;
};

export default formatDisplayDate;