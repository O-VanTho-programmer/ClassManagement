import { X } from "lucide-react";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import { useParams } from "next/navigation";
import { useHasPermission } from "@/hooks/useHasPermission";

type TableStudentRowProps = {
    student: StudentWithEnrollment
    onRemoveStudentFromClass: (student: StudentWithEnrollment) => void
}

export default function TableStudentRow({ student, onRemoveStudentFromClass }: TableStudentRowProps) {

    const { hub_id } = useParams();
    const { hasPermission: canRemoveStudentFromClass } = useHasPermission(hub_id as string, "REMOVE_STUDENT_CLASS");

    return (
        <tr className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-2">
                    <HeaderAvatar size="smaller" name={student.name} />
                    <p className="font-medium text-gray-800">{student.name}</p>
                </div>
            </td>

            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-blue-500" title={student.birthday || "--:--"} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-yellow-500" title={student.enroll_date} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                {student.status === 'Studying' ? (
                    <Badge bg_clr="bg-green-500" title={student.status} />
                ) : (
                    <Badge bg_clr="bg-orange-500" title={student.status} />
                )}
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex justify-end gap-1">
                    <Button style={!canRemoveStudentFromClass ? 'hide' : ''} color="red_off" onClick={() => onRemoveStudentFromClass(student)} icon={X} title="Remove from class" />
                </div>
            </td>
        </tr>
    )
}