import { useMemo, useState } from "react";
import AttendanceListStudentTableRow from "../AttendanceListStudentTableRow/AttendanceListStudentTableRow";
import { ModalEditAttendance } from "../ModalEditAttendance/ModalEditAttendance";
import { newAttendanceRecordsApi } from "@/lib/api/newAttendanceRecord";
import { useAlert } from "../AlertProvider/AlertContext";
import { useGetAttendanceRecordsQuery } from "@/hooks/useGetAttendanceRecords";
import { useQueryClient } from "@tanstack/react-query";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";

interface AttendanceListStudentTableProps {
    class_id: string;
    studentsList: StudentAttendance[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    startDate?: string;
    endDate?: string;
    selectedStudent: string;
    filteredStatus: string;
}

export default function AttendanceListStudentTable({
    class_id,
    studentsList, isLoading, isError, error,
    startDate,
    endDate,
    selectedStudent,
    filteredStatus
}: AttendanceListStudentTableProps) {

    // const { data: studentsList, isLoading, isError, error } = useGetAttendanceRecordsQuery(class_id);
    const [editingStudent, setEditingStudent] = useState<StudentAttendance | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { showAlert } = useAlert();
    const isModalOpen = !!editingStudent;

    const queryClient = useQueryClient();

    const filterStudentAttendance = useMemo(() => {
        if (!studentsList?.length) return [];

        let filteredStudents = studentsList;

        if (startDate) {
            filteredStudents = filteredStudents.filter((student) => {
                return formatDateForCompare(student.date) >= formatDateForCompare(startDate);
            });
        }

        if (endDate) {
            filteredStudents = filteredStudents.filter((student) => {
                return formatDateForCompare(student.date) <= formatDateForCompare(endDate);
            });
        }

        if (selectedStudent !== 'all-students') {
            filteredStudents = filteredStudents.filter((student) => {
                return student.id === selectedStudent;
            });
        }

        if (filteredStatus !== "all-status") {
            filteredStudents = filteredStudents.filter(student => {
                return student.present === filteredStatus;
            });
        }

        return filteredStudents;
    }, [studentsList, startDate, endDate, selectedStudent, filteredStatus])

    const openModalEdit = (student: StudentAttendance) => {
        setEditingStudent(student);
    }

    const handleCloseModal = () => {
        setEditingStudent(null);
    };

    const handleSaveAttendance = async (updatedStudent: StudentAttendance) => {

        setIsSaving(true);
        try {
            const res = await newAttendanceRecordsApi(updatedStudent, class_id);

            if (res?.status === 200) {
                console.log("Attendance saved:", updatedStudent);

                queryClient.setQueryData<StudentAttendance[]>(["studentAttendance", class_id], (prevStudents = []) =>
                    prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
                );

                queryClient.invalidateQueries({ queryKey: ["studentAttendance", class_id] });

                showAlert("Attendance saved successfully!", "success");
                handleCloseModal();
            } else {
                showAlert("Failed to save attendance. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            showAlert("An unexpected error occurred. Please try again.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <LoadingState fullScreen message="Loading attendance logs..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Attendance Logs"
            message={error?.message || "Something went wrong. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    return (
        <>
            <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">
                <div className="mx-9 py-4 overflow-x-scroll w-full overflow-y-auto h-[400px]">
                    <table className="border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[12%]">DATE</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[20%]">STUDENT</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">STATUS</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[10%]">SCORE</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-full">COMMENT</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">HOMEWORK</th>
                                <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">ACTION</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filterStudentAttendance?.map((student, index) => (
                                <AttendanceListStudentTableRow isHasHomework={student.is_homework} key={index} student={student} openModalEdit={openModalEdit} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* {editingStudent && (
                <ModalEditAttendance
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    studentAttendance={editingStudent}
                    onSave={handleSaveAttendance}
                    isSaving={isSaving}
                    // classHomeworkList={null}
                />
            )} */}
        </>

    )
}