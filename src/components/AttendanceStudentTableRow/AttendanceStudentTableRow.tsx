// import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";

// interface AttendanceStudentTableRowProps {
//     index: number
//     student: StudentAttendance,
//     setStudents: React.Dispatch<React.SetStateAction<StudentAttendance[]>>,
// }

// export default function AttendanceStudentTableRow({ index, student, setStudents }: AttendanceStudentTableRowProps) {

//     const handleToggleAttendance = (studentId: string, status: StudentAttendanceType) => {
//         setStudents(prevData =>
//             prevData.map(student =>
//                 student.id === studentId
//                     ? { ...student, present: student.present === status ? 'Absent' : status }
//                     : student
//             )
//         );
//     };

//     const handleToggleHomework = (studentId: string) => {
//         setStudents(prevData =>
//             prevData.map(student =>
//                 student.id === studentId
//                     ? { ...student, is_finished_homework: !student.is_finished_homework }
//                     : student
//             )
//         );
//     };

//     const handleCommentChange = (studentId: string, comment: string) => {
//         setStudents(prevData =>
//             prevData.map(student =>
//                 student.id === studentId ? { ...student, comment: comment } : student
//             )
//         );
//     };

//     const handleScoreChange = (studentId: string, score: number) => {
//         setStudents(prevData =>
//             prevData.map(student =>
//                 student.id === studentId ? { ...student, score: score } : student
//             )
//         );
//     };

//     return (
//         <tr className="border-b border-gray-200 text-sm">
//             <td className="py-4 px-2 whitespace-nowrap text-gray-800">
//                 {index}
//             </td>
//             <td className="py-4 px-2 whitespace-nowrap text-gray-800">
//                 <div className="flex items-center space-x-4">
//                     <HeaderAvatar size="smaller" />
//                     <div className="flex flex-col">
//                         <p className="font-semibold">{student.name}</p>
//                     </div>
//                 </div>
//             </td>
//             <td className="py-4 px-2 whitespace-nowrap">
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={() => handleToggleAttendance(student.id, 'Present')}
//                         className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${student.present === 'Present' ? 'bg-green-100 text-green-700 border-green-500' : 'bg-transparent text-gray-500 border-gray-300'} transition-colors`}
//                     >
//                         Có mặt
//                     </button>
//                     <button
//                         onClick={() => handleToggleAttendance(student.id, 'Absent')}
//                         className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${student.present === 'Absent' ? 'bg-red-100 text-red-700 border-red-500' : 'bg-transparent text-gray-500 border-gray-300'} transition-colors`}
//                     >
//                         Vắng
//                     </button>
//                     <button
//                         onClick={() => handleToggleAttendance(student.id, 'Late')}
//                         className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${student.present === 'Late' ? 'bg-yellow-100 text-yellow-700 border-yellow-500' : 'bg-transparent text-gray-500 border-gray-300'} transition-colors`}
//                     >
//                         Muộn
//                     </button>
//                     <button
//                         onClick={() => handleToggleAttendance(student.id, 'Excused')}
//                         className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${student.present === 'Excused' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'bg-transparent text-gray-500 border-gray-300'} transition-colors`}
//                     >
//                         Có phép
//                     </button>
//                 </div>
//             </td>

//             <td className="py-4 px-2 whitespace-nowrap">
//                 <input
//                     type="number"
//                     value={student.score}
//                     onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value))}
//                     className="w-16 h-8 text-center border rounded-md"
//                 />
//             </td>
//             <td className="py-4 px-2 whitespace-nowrap">
//                 <textarea
//                     value={student.comment}
//                     onChange={(e) => handleCommentChange(student.id, e.target.value)}
//                     placeholder="Give feedback..."
//                     className="w-full h-10 text-sm border rounded-md p-2"
//                 />
//             </td>
//             <td className="py-4 px-2 whitespace-nowrap">
//                 <input
//                     type="checkbox"
//                     checked={student.is_finished_homework}
//                     onChange={() => handleToggleHomework(student.id)}
//                     className="form-checkbox h-5 w-5 text-blue-600 rounded"
//                 />
//                 Finished
//             </td>
//         </tr>
//     )
// }