export default function getStartSundayOfWeek(date: Date){
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}