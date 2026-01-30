import api from "../axios";

export const newAttendanceRecordsList = async (newRecords: StudentAttendance[], classId: string) => {
    try {
      console.log(newRecords, classId )
      const res = await api.post(`/new_attendance_records_list`, {newRecords, classId});
      return res;
    } catch (error) {
      console.error("Failed to fetch hubs:", error);
      return null;
    }
  };