import formatDisplayDate from "@/utils/Format/formatDisplayDate";
import getDayNameFromDate from "@/utils/Format/getDateNameFromDate";
import generateDateRange from "@/utils/generateDateRange";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import AttendanceCell from "../AttendanceCell/AttendanceCell";
import { useMemo, useState } from "react";
import { ModalEditAttendance } from "../ModalEditAttendance/ModalEditAttendance";
import { useGetStudentAttendanceRecordsQuery } from "@/hooks/useGetStudentAttendanceRecordsQuery";
import { newAttendanceRecordsApi } from "@/lib/api/newAttendanceRecord";
import { useAlert } from "../AlertProvider/AlertContext";
import { Schedule } from "@/types/Schedule";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import { useQueryClient } from "@tanstack/react-query";
import formatDate from "@/utils/Format/formatDate";

interface AttendanceGridStudentTableProps {
    class_id: string,
    schedule: Schedule[];
    startDate: string,
    endDate: string,
}

export default function AttendanceGridStudentTable({ class_id, schedule, startDate, endDate }: AttendanceGridStudentTableProps) {

    const { data: fetchedStudents, isLoading, isError, error } = useGetStudentAttendanceRecordsQuery(class_id);
    const queryClient = useQueryClient();

    const studentsWithRecordMaps = useMemo(() => {
        // Return an empty array if data isn't ready
        if (!fetchedStudents) return [];

        // 2. Map over students ONCE
        return fetchedStudents.map(student => {
            // 3. Create the fast-lookup Map for this student
            const recordsMap = new Map<string, AttendanceRecord>();

            for (const record of student.records) {
                // 4. Normalize the date from the DB (e.g., "2025-10-15T17:00:00.000Z") 
                //    to a simple string ("2025-10-16")
                const recordDate = new Date(record.date);
                const year = recordDate.getFullYear();
                const month = (recordDate.getMonth() + 1).toString().padStart(2, '0');
                const day = recordDate.getDate().toString().padStart(2, '0');
                const localDateString = `${year}-${month}-${day}`;

                recordsMap.set(localDateString, record);
            }

            // 5. Return the student with their new record Map
            return {
                ...student,
                recordsMap, // Add the map to the student object
            };
        });
    }, [fetchedStudents]);

    const [isSaving, setIsSaving] = useState(false);
    const { showAlert } = useAlert();
    const dateRange = useMemo(() => generateDateRange(startDate, endDate, schedule), [startDate, endDate]);

    const [editingRecord, setEditingRecord] = useState<StudentAttendance | null>(null);
    const isModalOpen = !!editingRecord;

    const handleEditClick = (record: AttendanceRecord, studentId: string, studentName: string) => {
        setEditingRecord({
            id: studentId,
            name: studentName,
            date: record.date,
            present: record.present,
            comment: record.comment,
            is_finished_homework: record.is_finished_homework,
            score: record.score
        });
    };

    const handleCloseModal = () => {
        setEditingRecord(null);
    };

    const handleSaveAttendance = async (updatedRecord: StudentAttendance) => {
        if (!editingRecord) return;
        const targetStudentId = editingRecord.id;
        setIsSaving(true);

        try {
            const res = await newAttendanceRecordsApi(updatedRecord, class_id);

            if (res?.status === 200) {
                queryClient.setQueryData<StudentWithAttendanceRecordList[]>(["studentAttendanceRecords", class_id], (prevStudents = []) =>
                    prevStudents.map(student => {
                        if (student.id !== targetStudentId) {
                            return student;
                        }

                        // Find if the record already exists to update it, otherwise add it.
                        const recordExists = student.records.some(r => r.date === updatedRecord.date);
                        const newRecords = recordExists
                            ? student.records.map(r => r.date === updatedRecord.date ? updatedRecord : r)
                            : [...student.records, updatedRecord];

                        // Recalculate total sessions based on new records
                        const newTotalSessions = newRecords.filter(r =>
                            r.present === 'present' || r.present === 'late'
                        ).length;

                        return { ...student, total_sessions: newTotalSessions, records: newRecords };
                    })
                );
                showAlert("Attendance saved successfully!", "success");
                console.log(`Record saved for ${editingRecord.name} on ${updatedRecord.date}:`, updatedRecord);
                handleCloseModal();
            } else {
                showAlert("Failed to save attendance. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            showAlert("An unexpected error occurred while saving.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <LoadingState fullScreen message="Loading your students attendance records..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Attendance Records"
            message={error?.message || "Something went wrong while loading your attendance records. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    if (fetchedStudents === undefined || fetchedStudents === null) {
        return;
    }

    return (
        <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto w-full">

                <table className="min-w-full table-auto border-collapse">
                    <thead className="sticky top-0 z-30">
                        <tr className="bg-indigo-700 text-white shadow-lg">
                            {/* Fixed Columns */}
                            <th className="py-3 px-2 w-[50px] text-center text-xs font-medium uppercase border-r border-indigo-600 sticky left-0 z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                STT
                            </th>
                            <th className="py-3 px-2 w-[125px] text-left text-xs font-medium uppercase border-r border-indigo-600 sticky left-[50px] z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                Học sinh
                                <p className="text-xs font-normal opacity-80 mt-0.5">Name Of Student</p>
                            </th>
                            <th className="py-3 px-2 w-[100px] text-center text-xs font-medium uppercase border-r border-indigo-600 sticky left-[175px] z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                Studied Days
                                <span title="Total Studied Days" className="text-xs font-normal opacity-80 mt-0.5 ml-1 bg-indigo-500 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
                            </th>

                            {/* Dynamic Date Columns */}
                            {dateRange.map(dateString => (
                                <th key={dateString} className="py-3 px-2 text-center text-xs font-medium uppercase border-l border-indigo-600 min-w-[60px]">
                                    {formatDisplayDate(dateString)}
                                    <p className="text-xs font-normal opacity-80 mt-0.5">{getDayNameFromDate(dateString)}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentsWithRecordMaps.map((student, studentIndex) => {
                            const totalCheckedSessions = student.records.length;
                            return (
                                <tr key={student.id} className="hover:bg-gray-50 transition duration-150 relative">
                                    <td className="py-4 px-2 text-center text-sm font-bold text-blue-600 border-r border-gray-200 sticky left-0 z-10 bg-white min-w-[50px]">
                                        {studentIndex + 1}
                                    </td>

                                    <td className="py-4 px-2 text-sm text-gray-900 border-r border-gray-200 sticky left-[50px] z-10 bg-white min-w-[125px] shadow-[2px_0_2px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-start space-x-3">
                                            <HeaderAvatar name={student.name.charAt(0)} size="smaller" />
                                            <div className="flex flex-col">
                                                {student.name.split(' ').map((part, i) => (
                                                    <p key={i} className={`font-semibold leading-tight ${i === 0 ? 'text-base' : 'text-sm'}`}>
                                                        {part}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-2 text-center text-sm font-semibold text-indigo-600 border-r border-gray-200 sticky left-[175px] z-10 bg-white min-w-[100px] shadow-[2px_0_2px_-2px_rgba(0,0,0,0.1)]">
                                        {totalCheckedSessions}
                                    </td>

                                    {/* Attendance Cells for each date - SCROLLABLE */}
                                    {dateRange.map(dateString => {

                                        // 8. Get the record instantly! (O(1) lookup)
                                        const record = student.recordsMap.get(dateString) || {
                                            present: 'pending',
                                            score: null,
                                            is_finished_homework: undefined,
                                            comment: 'Not Checked Yet',
                                            date: dateString
                                        };

                                        return (
                                            <AttendanceCell
                                                key={dateString}
                                                record={record as any} // Cast as needed
                                                onEdit={(rec) => handleEditClick(rec, student.id, student.name)}
                                            />
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Attendance Edit Modal */}
            {editingRecord && (
                <ModalEditAttendance
                    student={editingRecord}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveAttendance}
                    isSaving={isSaving}
                />
            )}
        </div>
    )
}