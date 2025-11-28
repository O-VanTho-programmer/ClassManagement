import { Search } from "lucide-react";
import DatePicker from "../DatePicker/DatePicker";
import SelectionWithLabel from "../SelectionWithLabel/SelectionWithLabel";
import SquareButton from "../SquareButton/SquareButton";
import { useGetStudentListByClassId } from "@/hooks/useGetStudentListByClassId";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import { useState } from "react";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";

const optionsStatus = [
    { value: 'all-status', label: 'All' },
    { value: 'Active', label: 'Present' },
    { value: 'Inactive', label: 'Late' },
    { value: 'Excused', label: 'Excused' },
    { value: 'Absent', label: 'Absent' },
];

interface AttendanceListFilterProps {
    class_id: string,
    startDate?: string,
    endDate?: string,
    onFilter: (startDate: string, endDate: string, selectedStudent: string, selectedStatus: string) => void,
}

export default function AttendanceListFilter({
    class_id,
    startDate,
    endDate,
    onFilter,    
}: AttendanceListFilterProps) {

    const { data: studentList, isLoading, isError, error } = useGetStudentListByClassId(class_id);

    const [selectedStudent, setSelectedStudent] = useState('all-students');
    const [selectedStartDate, setSelectedStartDate] = useState<string>(startDate || "");
    const [selectedEndDate, setSelectedEndDate] = useState<string>(endDate || "");
    const [statusFilter, setStatusFiler] = useState("all-status");

    const optionStudents = [
        { value: "all-students", label: "All" },
        ...(studentList?.map(s => ({ value: s.id, label: s.name })) ?? [])
    ];

    const handleChangeStartDate = (date: string) => {
        setSelectedStartDate(date);
    }

    const handleChangeEndDate = (date: string) => {
        setSelectedEndDate(date);
    }

    const hanldeChangeSelectStudent = (value: string) => {
        setSelectedStudent(value);
    }

    const handleChangeFilterSatus = (value: string) => {
        setStatusFiler(value);
    }

    const handleFilter = () => {
        onFilter(selectedStartDate || "", selectedEndDate || "", selectedStudent, statusFilter);
    }

    if (isLoading) {
        return <LoadingState message="Loading student list..." />
    }

    if (isError) {
        return <ErrorState message={error?.message || "Something went wrong. Please try again."} />
    }

    return (
        <div className="bg-white shadow-md rounded-xl pt-10 p-6 flex items-center gap-2 mb-6">
            <DatePicker size="smaller" date={formatDateForCompare(selectedStartDate)} label="Start date" onChange={handleChangeStartDate} />
            <DatePicker size="smaller" date={formatDateForCompare(selectedEndDate)} label="End date" onChange={handleChangeEndDate} />

            <SelectionWithLabel
                label="Học sinh"
                options={optionStudents}
                initialValue={selectedStudent}
                onChange={hanldeChangeSelectStudent}
            />
            <SelectionWithLabel
                label="Trạng thái"
                options={optionsStatus}
                initialValue="all-status"
                onChange={handleChangeFilterSatus}
            />

            <SquareButton color="blue" icon={Search} onClick={handleFilter} />
        </div>
    )

}