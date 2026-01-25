export default function formatOverlapClasses(overlapClasses: OverlapRow[]) : FormattedOverlap {
    return overlapClasses.reduce<FormattedOverlap>((acc, row) => {
        const studentId = row.student_id;

        if(!acc[studentId]){
            acc[studentId] = {
                student_name: row.student_name,
                overlaped_classes: []
            }
        }

        acc[studentId].overlaped_classes.push({
            class_id: row.class_id,
            class_name: row.class_name,
            day_of_week: row.day_of_week,
            start_time: row.start_time,
            end_time: row.end_time
        })

        return acc;
    }, {});
}