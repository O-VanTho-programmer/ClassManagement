import api from "../axios";

export async function fetchStudentGradeBookByClassId(class_id: string, hub_id: string): Promise<GradebookResponse | null> {
    try {
        const res = await api.get(`/get_students_grade_book_by_class_hub_id?hub_id=${hub_id}&class_id=${class_id}`);
        console.log('Fetch public id form response:', res);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch public id form:", error);
        return null;
    }
}

export interface AssignmentColumn {
    class_homework_id: number;
    title: string;
}

export type GradebookColumns = Record<string, AssignmentColumn[]>;

export interface AssignmentDetail {
    grade: number | null;
    feedback: string | null;
    submission_urls: string | null; // Or specifically an array/JSON object depending on how you parse it later
    homework_status: 'Finished' | 'Late' | 'Missed' | 'Pending'; // Based on your SQL ENUM
    homework_type: string;
}

export interface StudentGradebookRow {
    id: number;
    name: string;
    assignments: Record<number, AssignmentDetail>;
    averages: Record<string, number>; 
    total_grade: number;
    final_grade: number;
}

export interface GradebookResponse {
    message: string;
    columns: GradebookColumns;
    data: StudentGradebookRow[];
}