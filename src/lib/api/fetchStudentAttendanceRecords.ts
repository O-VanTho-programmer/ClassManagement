import { Schedule } from "@/types/Schedule";
import api from "../axios";

export const fetchStudentAttendanceRecords = async (class_id?: string, schedule?: Schedule[]): Promise<StudentWithAttendanceRecordList[] | null> => {
  try {
    if (!class_id) {
      console.warn("No classId provided — skipping fetchStudentAttendanceRecords");
      return null;
    }

    const scheduleParam = encodeURIComponent(JSON.stringify(schedule));

    const res = await api.get(`/get_student_attendance_record?classId=${class_id}&schedule=${scheduleParam}`);
    console.log('Fetch attendance record response:', res);
    return res.data.studentAttendanceRecords as StudentWithAttendanceRecordList[];
  } catch (error) {
    console.error("Failed to fetch attendance record:", error);
    return null;
  }
};
