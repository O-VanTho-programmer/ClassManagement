export default function getWeekDays(start_date_week: Date){
    const days = [];
    const currentDate = new Date(start_date_week);

    for(let i = 0; i < 7; i++){
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
}