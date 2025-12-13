// 'use client'

// import AttendanceStudentTable from "@/components/AttendanceStudentTable/AttendanceStudentTable";
// import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
// import DatePicker from "@/components/DatePicker/DatePicker";
// import { useGetClassById } from "@/hooks/useGetClassById";
// import { ArrowLeftIcon, CalendarDays, CheckIcon, List } from "lucide-react";
// import { useParams } from "next/navigation";

// export default function AttendancePage() {
//     const { class_id } = useParams();
//     const { data: classData, isLoading: isLoadingClass, isError: isErrorClass, error: errorClass } = useGetClassById(class_id as string);    
  
//     const onChangeDate = () => {

//     }

//     return (
//         <>
//             {/* Header */}
//             <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">
//                 <div className="flex items-center space-x-2 text-blue-600">
//                     <CheckIcon />
//                     <span className="text-lg font-semibold">Điểm danh - Anh 6.1 - Thứ 4, CN - 2025</span>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                     <button className="flex items-center space-x-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
//                         <ArrowLeftIcon />
//                         <span>Quay lại</span>
//                     </button>
//                     <button className="flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
//                         <List />
//                         <span>Danh sách</span>
//                     </button>
//                 </div>
//             </div>
//             {/*  */}

//             <div className="bg-white shadow-md rounded-xl pt-10 p-6 mb-6">
//                 <DatePicker icon={CalendarDays} label="Chọn ngày điểm danh" onChange={onChangeDate} />
//             </div>

//             <AttendanceSummary />
//             <AttendanceStudentTable/>
            
//         </>
//     )
// }