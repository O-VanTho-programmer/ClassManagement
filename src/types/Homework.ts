interface HomeworkInputDto{
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