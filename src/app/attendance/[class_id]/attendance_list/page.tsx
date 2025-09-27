'use client';

import AttendanceListFilter from "@/components/AttendanceListFilter/AttendanceListFilter";
import AttendanceListStudentTable from "@/components/AttendanceListStudentTable/AttendanceListStudentTable";
import AttendanceListStudentTableRow from "@/components/AttendanceListStudentTableRow/AttendanceListStudentTableRow";
import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";
import { classData } from "@/data_sample/classDataSample";
import calculateScheduledDays from "@/utils/calculateScheduledDays";
import { Calendar, GraduationCap, Users } from "lucide-react";

export default function AttendanceListPage() {

    const classInfo = classData[0];
    const totalDays = calculateScheduledDays(classInfo.schedule, classInfo.startDate, classInfo.endDate);

    return (
        <LayoutDashboard>
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
            <AttendanceListStudentTable/>
        </LayoutDashboard>
    )
}