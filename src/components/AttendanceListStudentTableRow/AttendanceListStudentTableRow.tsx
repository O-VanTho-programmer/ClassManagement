import { Check, X } from "lucide-react"
import Badge from "../Badge/Badge"
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar"

interface AttendanceListStudentTableRowProps {
    student: AttendanceListStudents
}

export default function AttendanceListStudentTableRow({ student }: AttendanceListStudentTableRowProps) {
    return (
        <tr className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <p className="text-base text-gray-500">{student.date}</p>
                <p className="text-sm text-gray-400">{student.day}</p>
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
                {student.present === 'present' ? (
                    <Badge bg_clr="bg-green-100 text-green-700! border-green-500" title="Present" />
                ) : student.present === 'excused' ? (
                    <Badge bg_clr="bg-blue-100 text-blue-700! border-blue-500" title="Excused" />
                ) : student.present === 'absent' ? (
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
                {student.is_finished_homework ? (
                    <span className="block w-fit bg-green-400 text-white rounded-full p-1"><Check /></span>
                ) : (
                    <span className="block w-fit bg-red-400 text-white rounded-full p-1"><X /></span>
                )}
            </td>
        </tr>
    )
}