import api from "../axios";

export const fetchStudentAttendanceRecords = async (class_id?: string): Promise<StudentWithAttendanceRecordList[] | null> => {
  try {
    if (!class_id) {
      console.warn("No classId provided — skipping fetchStudentAttendanceRecords");
      return null;
    }

    const res = await api.get(`/get_student_attendance_record?classId=${class_id}`);
    console.log('Fetch attendance record response:', res);
    return res.data as StudentWithAttendanceRecordList[];
  } catch (error) {
    console.error("Failed to fetch attendance record:", error);
    return null;
  }
};
