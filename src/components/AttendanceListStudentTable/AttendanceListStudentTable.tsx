import { useState } from "react";
import AttendanceListStudentTableRow from "../AttendanceListStudentTableRow/AttendanceListStudentTableRow";
import { studentsAttendanceSample } from "@/data_sample/studentAttendanceSample";
import { ModalEditAttendance } from "../ModalEditAttendance/ModalEditAttendance";
import { newAttendanceRecordsApi } from "@/lib/api/newAttendanceRecord";
import { useAlert } from "../AlertProvider/AlertContext";
import { useParams } from "next/navigation";

export default function AttendanceListStudentTable({class_id}: {class_id: string}) {
    
    const [studentDatas, setStudentDatas] = useState<StudentAttendance[]>(studentsAttendanceSample);
    const [editingStudent, setEditingStudent] = useState<StudentAttendance | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { showAlert } = useAlert();
    const isModalOpen = !!editingStudent;

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

            console.log("Attendance saved:", updatedStudent);

            if (res?.status === 200) {
                setStudentDatas(prevStudents =>
                    prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
                );
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

    return (
        <>
            <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">
                <div className="mx-9 py-4 overflow-x-scroll w-full">
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
                            {studentDatas.map((student, index) => (
                                <AttendanceListStudentTableRow key={index} student={student} openModalEdit={openModalEdit} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

            {editingStudent && (
                <ModalEditAttendance
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    student={editingStudent}
                    onSave={handleSaveAttendance}
                    isSaving={isSaving}
                />
            )}
        </>

    )
}