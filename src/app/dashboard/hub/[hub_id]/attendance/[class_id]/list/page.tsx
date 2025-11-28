'use client';

import AttendanceListFilter from "@/components/AttendanceListFilter/AttendanceListFilter";
import AttendanceListStudentTable from "@/components/AttendanceListStudentTable/AttendanceListStudentTable";
import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
import { useGetAttendanceRecordsQuery } from "@/hooks/useGetAttendanceRecords";
import { useGetClassById } from "@/hooks/useGetClassById";
import calculateScheduledDays from "@/utils/calculateScheduledDays";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { Calendar, GraduationCap, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttendanceListPage() {
    const { class_id } = useParams();
    const { data: classInfo, isLoading: isLoadingClass, isError: isErrorClass, error: errorClass } = useGetClassById(class_id as string);
    const { data: studentsList = [], isLoading, isError, error } = useGetAttendanceRecordsQuery(class_id as string);

    const [selectedStartDate, setSelectedStartDate] = useState<string | undefined>(classInfo?.startDate);
    const [selectedEndDate, setSelectedEndDate] = useState<string | undefined>(classInfo?.endDate);
    const [selectedStudent, setSelectedStudent] = useState('all-students');
    const [filteredStatus, setFilteredStatus] = useState('all-status');

    useEffect(() => {
        if (classInfo) {
            setSelectedStartDate(formatDateForCompare(classInfo.startDate));
            setSelectedEndDate(formatDateForCompare(classInfo.endDate));
        }
    }, [classInfo]);

    if (classInfo == null || classInfo == undefined) {
        return null;
    }

    const handleFilter = (startDate: string, endDate: string, selectedStudent: string, selectedStatus: string) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
        setSelectedStudent(selectedStudent);
        setFilteredStatus(selectedStatus);
    }

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

            <AttendanceListFilter
                class_id={class_id as string}
                startDate={classInfo.startDate}
                endDate={classInfo.endDate}
                onFilter={handleFilter}
            />
            <AttendanceSummary />
            <AttendanceListStudentTable
                class_id={classInfo.id}
                studentsList={studentsList || []}
                isLoading={isLoadingClass}
                isError={isErrorClass}
                error={errorClass}
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                selectedStudent={selectedStudent}
                filteredStatus={filteredStatus}
            />
        </>
    )
}