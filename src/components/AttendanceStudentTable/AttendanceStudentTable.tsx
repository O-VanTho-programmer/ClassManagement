// import { studentsAttendanceSample } from "@/data_sample/studentAttendanceSample";
// import AttendanceStudentTableRow from "../AttendanceStudentTableRow/AttendanceStudentTableRow";
// import { useState } from "react";
// import AttendanceListStudentTableRow from "../AttendanceListStudentTableRow/AttendanceListStudentTableRow";

// export default function AttendanceStudentTable() {
//     const [studentDatas, setStudentDatas] = useState<StudentAttendance[]>(studentsAttendanceSample);

//     return (
//         <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">
//             <div className="mx-9 py-4 overflow-x-scroll">
//                 <table className="border-collapse">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[5%]">No</th>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[5%]">STUDENT</th>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[20%]">STATUS</th>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">SCORE</th>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-full">COMMENT</th>
//                             <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">HOMEWORK</th>
//                         </tr>
//                     </thead>

//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {studentDatas.map((student, index) => (
//                             <AttendanceStudentTableRow key={index} index={index + 1} student={student} setStudents={setStudentDatas} />
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div >
//     )
// }