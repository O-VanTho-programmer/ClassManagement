export interface Hub{
    id: number,
    name: string,
    description: string,
    numberOfClasses: number
    numberOfTeachers: number;
    owner: string,
}

export interface HubAddDto{
    name: string,
    description: string,
    includedTeachers: string[];
    owner: string,
}