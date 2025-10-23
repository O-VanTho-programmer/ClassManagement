'use client';

import AttendanceListFilter from "@/components/AttendanceListFilter/AttendanceListFilter";
import AttendanceListStudentTable from "@/components/AttendanceListStudentTable/AttendanceListStudentTable";
import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
import { useGetClassById } from "@/hooks/useGetClassById";
import { ClassData } from "@/types/ClassData";
import calculateScheduledDays from "@/utils/calculateScheduledDays";
import { Calendar, GraduationCap, Users } from "lucide-react";
import { useParams } from "next/navigation";

export default function AttendanceListPage() {
    const { class_id } = useParams();
    const { data: classInfo, isLoading: isLoadingClass, isError: isErrorClass, error: errorClass } = useGetClassById(class_id as string);    
    
    if(classInfo == null || classInfo == undefined){
        return null;
    }

    // Tong so buoi hoc
    const totalDays = calculateScheduledDays(classInfo.schedule, classInfo.startDate, classInfo.endDate);

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-md rounded-xl p-6 flex items-center mb-6">
                <span className="bg-blue-50 text-blue-600 flex items-center justify-center w-[50px] h-[50px] ">
                    <GraduationCap size={30} />
                </span>

                <div className="ml-2">
                    <span className="text-base font-bold">{classInfo.name}</span>
                    <p className="flex items-center text-gray-500 font-medium">
                        <Users size={16} />{classInfo.studentCount} students
                        <span className="mx-2">-</span>
                        <Calendar size={16} />{totalDays} days
                    </p>
                </div>
            </div>
            {/*  */}

            <AttendanceListFilter />
            <AttendanceSummary />
            <AttendanceListStudentTable class_id= {classInfo.id}/>
        </>
    )
}