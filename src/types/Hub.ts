interface Hub{
    Id: number,
    Name: string,
    Description: string,
    NumberOfClasses: number
    NumberOfTeachers: number;
    Owner: string,
}

interface HubAddDto{
    Name: string,
    Description: string,
    IncludedTeachers: string[];
    Owner: string,
}