import { useState } from "react";
import TableStudentRow from "../TableStudentRow/TableStudentRow";
import ConfirmDeleteStudentFromClass from "../ConfirmDeleteStudentFromClass/ConfirmDeleteStudentFromClass";
import { useRemoveStudentFromClass } from "@/hooks/useRemoveStudentFromClass";
import { useParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Invoice } from "@/lib/api/fetchClassInvoices";

interface TableStudentListProps {
    studentDatas: StudentWithEnrollment[];
    invoices?: Invoice[];
}

export default function TableStudentList({ studentDatas, invoices = [] }: TableStudentListProps) {
    const { class_id } = useParams();

    const [openConfirmDeleteStudent, setOpenConfirmDeleteStudent] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithEnrollment | null>(null);

    const { isRemoving, handleRemoveStudentFromClass } = useRemoveStudentFromClass();

    const handleClosingRemoveConfirmation = () => {
        setOpenConfirmDeleteStudent(false);
        setSelectedStudent(null);
    }

    if (studentDatas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No Students Found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                    No students match the criteria or are enrolled in this class.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">STUDENT</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">BIRTHDAY</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">ENROLL DATE</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">CLASS STATUS</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">TUITION STATUS</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">ACTION</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {studentDatas.map((student, index) => {
                            const studentInvoices = invoices.filter(inv => inv.student_id === Number(student.id));
                            const latestInvoice = studentInvoices.length > 0 
                                ? [...studentInvoices].sort((a, b) => b.version - a.version)[0] 
                                : null;

                            return (
                                <TableStudentRow 
                                    key={index} 
                                    student={student}
                                    latestInvoice={latestInvoice}
                                    onRemoveStudentFromClass={() => {
                                        setOpenConfirmDeleteStudent(true);
                                        setSelectedStudent(student);
                                    }}
                                />
                            );
                        })}
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