import { Check, EditIcon, X } from "lucide-react"
import Badge from "../Badge/Badge"
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar"
import SquareButton from "../SquareButton/SquareButton"
import getDayNameFromDate from "@/utils/Format/getDateNameFromDate"

interface AttendanceListStudentTableRowProps {
    student: StudentAttendance
    openModalEdit: (studentId: StudentAttendance) => void;
    isHasHomework?: boolean;
}

export default function AttendanceListStudentTableRow({ student, openModalEdit, isHasHomework }: AttendanceListStudentTableRowProps) {
    
    const handleOpenModalEdit = () => {
        openModalEdit(student);
    }

    return (
        <tr className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <p className="text-base text-gray-500">{student.date}</p>
                <p className="text-sm text-gray-400">{getDayNameFromDate(student.date)}</p>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-4">
                    <HeaderAvatar size="smaller" />
                    <div className="flex flex-col">
                        <p className="font-semibold">{student.name}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap">
                {student.present === 'Present' ? (
                    <Badge bg_clr="bg-green-100 text-green-700! border-green-500" title="Present" />
                ) : student.present === 'Excused' ? (
                    <Badge bg_clr="bg-blue-100 text-blue-700! border-blue-500" title="Excused" />
                ) : student.present === 'Absent' ? (
                    <Badge bg_clr="bg-red-100 text-red-700! border-red-500" title="Absent" />
                ) : (
                    <Badge bg_clr="bg-yellow-100 text-yellow-700! border-yellow-500" title="Absent" />
                )}
            </td>

            <td className="py-4 px-2 whitespace-nowrap text-center">
                {student.score ? (
                    <span className="text-black font-bold">{student.score}</span>
                ) : (
                    <span className="text-gray-500 font-bold">-</span>
                )}
            </td>
            <td className="py-4 px-2 whitespace-nowrap">
                <p>{student.comment ?? "No comment"}</p>
            </td>
            <td className="py-4 px-2 whitespace-nowrap">
                {/* {!isHasHomework ? (
                    <span className="inline-block w-6 text-gray-500 font-bold p-1">-</span>
                ) : (
                    student.is_homework ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-400 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3 h-3" />
                        </span>
                    ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-red-400 text-white rounded-full p-1 shadow-md">
                            <X className="w-3 h-3" />
                        </span>
                    )
                )} */}
            </td>
            <td className="py-4 px-2 whitespace-nowrap">
                <SquareButton color="blue" icon={EditIcon} onClick={handleOpenModalEdit}/>
            </td>
        </tr>
    )
}