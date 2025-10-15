import api from "../axios";

export const newAttendanceRecordsApi = async (newRecord: StudentAttendance, classId: string) => {
    try {
      const res = await api.post(`/new_attendance_record`, {newRecord, classId});
      return res;
    } catch (error) {
      console.error("Failed to fetch hubs:", error);
      return null;
    }
  };