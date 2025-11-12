'use client';

import { useAlert } from "@/components/AlertProvider/AlertContext";
import AttendanceGridFilter from "@/components/AttendanceGridFilter/AttendanceGridFilter";
import AttendanceGridStudentTable from "@/components/AttendanceGridStudentTable/AttendanceGridStudentTable";
import AttendanceSummary from "@/components/AttendanceSummary/AttendanceSummary";
import ErrorState from "@/components/QueryState/ErrorState";
import LoadingState from "@/components/QueryState/LoadingState";
import { useGetClassById } from "@/hooks/useGetClassById";
import calculateScheduledDays from "@/utils/calculateScheduledDays";
import { Calendar, GraduationCap, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttendanceGridPage() {
    const { showAlert } = useAlert();

    const { hub_id, class_id } = useParams();
    const { data: classInfo, isLoading: isLoadingClass, isError: isErrorClass, error: errorClass } = useGetClassById(class_id as string);

    const [startDate, setStartDate] = useState<string | undefined>(classInfo?.startDate);
    const [endDate, setEndDate] = useState<string | undefined>(classInfo?.endDate);

    let totalDays = 0;

    useEffect(() => {

        if (classInfo) {
            setStartDate(classInfo.startDate);
            setEndDate(classInfo.endDate);

            totalDays = calculateScheduledDays(classInfo.schedule, classInfo.startDate, classInfo.endDate);
        }
    }, [classInfo]);

    const handleFilter = (selectedStartDate: any, selectedEndDate: any) => {
        if (selectedStartDate === undefined || selectedEndDate === undefined) {
            showAlert("Invalid Date", 'error');
            return;
        }
        setStartDate(selectedStartDate);
        setEndDate(selectedEndDate);
    }

    const handleResetFilter = () => {
        setStartDate(classInfo?.startDate);
        setEndDate(classInfo?.endDate);
    }

    if (isLoadingClass || !classInfo || !startDate || !endDate) return <LoadingState fullScreen message="Loading your class..." />;
    if (isErrorClass) return (
        <ErrorState
            fullScreen
            title="Error Loading Class"
            message={errorClass?.message || "Something went wrong while loading your class. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

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

            <AttendanceGridFilter 
                onFilter={handleFilter}
                onResetFilter={handleResetFilter}
                startDate={startDate} endDate={endDate} />
            <AttendanceSummary />
            <AttendanceGridStudentTable hub_id={hub_id as string} class_id={classInfo.id} schedule={classInfo.schedule} startDate={startDate} endDate={endDate} />
        </>
    )
}