import { useState } from "react";
import AttendanceListStudentTableRow from "../AttendanceListStudentTableRow/AttendanceListStudentTableRow";
import { studentsAttendanceSample } from "@/data_sample/studentAttendanceSample";
import { ModalEditAttendance } from "../ModalEditAttendance/ModalEditAttendance";

export default function AttendanceListStudentTable() {
    const [studentDatas, setStudentDatas] = useState<StudentAttendance[]>(studentsAttendanceSample);
    const [editingStudent, setEditingStudent] = useState<StudentAttendance | null>(null);
    const isModalOpen = !!editingStudent;

    const openModalEdit = (student: StudentAttendance) => {
        setEditingStudent(student);
    }

    const handleCloseModal = () => {
        setEditingStudent(null);
    };

    const handleSaveAttendance = (updatedStudent: StudentAttendance) => {
        setStudentDatas(prevStudents =>
            prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        );
        console.log("Attendance saved:", updatedStudent);
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
                />
            )}
        </>

    )
}