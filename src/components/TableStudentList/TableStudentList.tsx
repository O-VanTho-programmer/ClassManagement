import { useState } from "react";
import TableStudentRow from "../TableStudentRow/TableStudentRow";
import ConfirmDeleteStudentFromClass from "../ConfirmDeleteStudentFromClass/ConfirmDeleteStudentFromClass";
import { useRemoveStudentFromClass } from "@/hooks/useRemoveStudentFromClass";
import { useParams } from "next/navigation";

interface TableStudentListProps {
    studentDatas: StudentWithEnrollment[]
}

export default function TableStudentList({ studentDatas }: TableStudentListProps) {
    const { class_id } = useParams();

    const [openConfirmDeleteStudent, setOpenConfirmDeleteStudent] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithEnrollment | null>(null);

    const { isRemoving, handleRemoveStudentFromClass } = useRemoveStudentFromClass();

    const handleClosingRemoveConfirmation = () => {
        setOpenConfirmDeleteStudent(false);
        setSelectedStudent(null);
    }

    return (
        <>
            <div className="mx-9 py-4 overflow-scroll h-[400px]">
                <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
            `}</style>
                <table className="border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[5%]">STUDENT</th>
                            <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[20%]">BIRTHDAY</th>
                            <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">ENROLL DATE</th>
                            <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">STATUS</th>
                            <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-full">ACTION</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentDatas.map((student, index) => (
                            <TableStudentRow key={index} student={student}
                                onRemoveStudentFromClass={() => {
                                    setOpenConfirmDeleteStudent(true);
                                    setSelectedStudent(student);
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {openConfirmDeleteStudent && selectedStudent && (
                <ConfirmDeleteStudentFromClass
                    isOpen={openConfirmDeleteStudent}
                    onClose={handleClosingRemoveConfirmation}
                    isDeleting={isRemoving}
                    onConfirm={async () => {
                        await handleRemoveStudentFromClass(selectedStudent.id, class_id as string)
                        handleClosingRemoveConfirmation();
                    }}
                    student={selectedStudent}
                />
            )}
        </>
    )
}