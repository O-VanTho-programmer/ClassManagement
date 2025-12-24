interface Teacher {
    id: string,
    name: string,
    email: string,
    phone?: string,
    address?: string,
    is_owner?: boolean,
}

interface TeacherInHub extends Teacher {
    role_hub: 'Master' | 'Member' | 'Owner',
    permissions: string[],
}

type TeacherWorkload = TeacherInHub & {
    classCount: number;
    studentCount: number;
}

type TeacherDetails = TeacherWorkload & {
    assignedClassIds: string[]; // An array of class IDs
  }

