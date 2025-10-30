export interface Hub{
    id: number,
    name: string,
    description: string,
    numberOfClasses: number
    numberOfTeachers: number;
    owner: string,
    isOwner: 1 | 0,
}

export interface HubAddDto{
    name: string,
    description: string,
    includedTeachers: string[];
    owner: string,
}