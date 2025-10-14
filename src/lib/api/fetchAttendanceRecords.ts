import api from "../axios";

export const fetchAttendanceRecords = async (class_id: string): Promise<StudentAttendance[] | null>=> {
    try{
        if (!class_id) {
            console.warn("No classId provided — skipping fetchAttendanceRecords");
            return null;
        }

        const res = await api.get(`/get_attendance_records?classId=${class_id}`);
        console.log('Fetch attendance record response:', res);
        return res.data as StudentAttendance[]
    }catch(error){
        console.error("Failed to fetch attendance record:", error);
        return null;
    }
}