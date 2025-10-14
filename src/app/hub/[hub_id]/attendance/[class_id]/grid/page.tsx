'use client';   

import AttendanceGridFilter from "@/components/AttendanceGridFilter/AttendanceGridFilter";
import AttendanceGridStudentTable from "@/components/AttendanceGridStudentTable/AttendanceGridStudentTable";
import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";
import { classData } from "@/data_sample/classDataSample";
import calculateScheduledDays from "@/utils/calculateScheduledDays";
import { Calendar, GraduationCap, Users } from "lucide-react";
import { useState } from "react";

export default function AttendanceGridPage() {
    const classInfo = classData[0];

    const [startDate, setStartDate] = useState<string>(classInfo.startDate);
    const [endDate, setEndDate] = useState<string>(classInfo.endDate);


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

            <AttendanceGridFilter startDate={startDate} endDate={endDate} />
            <AttendanceSummary />
            <AttendanceGridStudentTable schedule={classInfo.schedule} startDate={startDate} endDate={endDate} />
        </>
    )
}