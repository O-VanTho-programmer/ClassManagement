interface HomeworkInputDto {
    hub_id: string,
    title: string,
    content: string,
    created_by_user_id: string
}

interface Homework extends HomeworkInputDto {
    id: string,
    created_date: string,
    created_by_user_name: string,
}

interface HomeworkAssignedClassesDTO {
    homework_id: string,
    class_id: string,
    assigned_date: string,
    due_date: string,
}

// interface HomeworkWithClass extends Homework {
//     class_list: {
//         class_id: string,
//         name: string,
//         assigned_date: string,
//         due_date: string,
//     }[]
// }

interface ClassHomework{
    class_homework_id: string,
    class_id: string,
    homework_id: string,
    title: string,
    content: string,
    assigned_date: string,
    due_date: string,
    created_by_user_name: string,
}