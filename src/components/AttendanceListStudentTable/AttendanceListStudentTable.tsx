import { useState } from "react";
import AttendanceListStudentTableRow from "../AttendanceListStudentTableRow/AttendanceListStudentTableRow";
import { attendanceListStudentsSample } from "@/data_sample/attendanceListStudentsSample";

export default function AttendanceListStudentTable() {
    const [studentDatas, setStudentDatas] = useState<AttendanceListStudents[]>(attendanceListStudentsSample);

    return (
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
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentDatas.map((student, index) => (
                            <AttendanceListStudentTableRow key={index} student={student} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}