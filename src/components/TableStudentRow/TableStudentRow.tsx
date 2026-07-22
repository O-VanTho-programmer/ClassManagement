import { X } from "lucide-react";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import { useParams } from "next/navigation";
import { useHasPermission } from "@/hooks/useHasPermission";
import { Invoice } from "@/lib/api/fetchClassInvoices";

type TableStudentRowProps = {
    student: StudentWithEnrollment
    latestInvoice?: Invoice | null
    onRemoveStudentFromClass: (student: StudentWithEnrollment) => void
}

export default function TableStudentRow({ student, latestInvoice, onRemoveStudentFromClass }: TableStudentRowProps) {
    const { hub_id } = useParams();
    const { hasPermission: canRemoveStudentFromClass } = useHasPermission(hub_id as string, "REMOVE_STUDENT_CLASS");


    return (
        <tr className="border-b border-slate-100 text-sm hover:bg-slate-50/50 transition-colors duration-150">
            <td className="py-3.5 px-6 whitespace-nowrap text-slate-800">
                <div className="flex items-center space-x-3">
                    <HeaderAvatar size="smaller" name={student.name} />
                    <p className="font-semibold text-slate-700">{student.name}</p>
                </div>
            </td>

            <td className="py-3.5 px-6 whitespace-nowrap text-slate-500">
                {student.birthday ? (
                    <Badge bg_clr="bg-slate-100" text_clr="text-slate-600" title={student.birthday} />
                ) : (
                    <span className="text-slate-400 font-medium">-- : --</span>
                )}
            </td>
            
            <td className="py-3.5 px-6 whitespace-nowrap text-slate-500">
                <Badge bg_clr="bg-indigo-50" text_clr="text-indigo-700" title={student.enroll_date} />
            </td>
            
            <td className="py-3.5 px-6 whitespace-nowrap">
                {student.status === 'Studying' ? (
                    <Badge bg_clr="bg-emerald-50" text_clr="text-emerald-700" title={student.status} />
                ) : (
                    <Badge bg_clr="bg-amber-50" text_clr="text-amber-700" title={student.status || "Inactive"} />
                )}
            </td>
            
            <td className="py-3.5 px-6 whitespace-nowrap">
                {latestInvoice ? (
                    latestInvoice.is_paid === 1 ? (
                        <Badge bg_clr="bg-emerald-50" text_clr="text-emerald-700" title={`Paid (Cycle ${latestInvoice.version})`} />
                    ) : new Date(latestInvoice.due_date) < new Date() ? (
                        <Badge bg_clr="bg-rose-50" text_clr="text-rose-700" title={`Overdue (Cycle ${latestInvoice.version})`} />
                    ) : (
                        <Badge bg_clr="bg-amber-50" text_clr="text-amber-700" title={`Unpaid (Cycle ${latestInvoice.version})`} />
                    )
                ) : (
                    <Badge bg_clr="bg-slate-100" text_clr="text-slate-500" title="No Invoice" />
                )}
            </td>
            
            <td className="py-3.5 px-6 whitespace-nowrap text-slate-800">
                <div className="flex justify-end">
                    <Button 
                        style={!canRemoveStudentFromClass ? 'hide' : ''} 
                        color="red_off" 
                        onClick={() => onRemoveStudentFromClass(student)} 
                        icon={X} 
                        title="Remove" 
                    />
                </div>
            </td>
        </tr>
    )
}