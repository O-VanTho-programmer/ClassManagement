type OverlapRow = {
    student_id: string;
    student_name: string;
    class_id: string;
    class_name: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
};

type FormattedOverlap = Record<
    string,
    {
        student_name: string;
        overlaped_classes: {
            class_name: string;
            class_id: string;
            day_of_week: string;
            start_time: string;
            end_time: string;
        }[];
    }
>;
