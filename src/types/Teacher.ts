interface Teacher {
    id: string,
    name: string,
    email: string,
    phone?: string,
    address?: string,
}

interface TeacherInHub extends Teacher {
    role_hub: 'Master' | 'Member' | 'Owner',
}

type TeacherWorkload = TeacherInHub & {
    classCount: number;
    studentCount: number;
}

type TeacherDetails = TeacherWorkload & {
    assignedClassIds: string[]; // An array of class IDs
  }

