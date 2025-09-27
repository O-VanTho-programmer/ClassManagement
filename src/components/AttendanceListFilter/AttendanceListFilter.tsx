import { Search } from "lucide-react";
import DatePicker from "../DatePicker/DatePicker";
import SelectionWithLabel from "../SelectionWithLabel/SelectionWithLabel";
import SquareButton from "../SquareButton/SquareButton";


const optionsStudent = [
    { value: 'all-students', label: 'Tất cả học sinh' },
    { value: 'student-a', label: 'Học sinh A' },
    { value: 'student-b', label: 'Học sinh B' },
    { value: 'student-c', label: 'Học sinh C' },
];

const optionsStatus = [
    { value: 'all-status', label: 'Tất cả' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
];

export default function AttendanceListFilter() {

    const onChangeStartDate = () => {

    }

    const onChangeEndDate = () => {

    }

    const onChangeSelectStudent = () => {

    }

    const onFilter = () => {

    }

    return (
        <div className="bg-white shadow-md rounded-xl pt-10 p-6 flex items-center gap-2 mb-6">
            <DatePicker size="smaller" label="Start date" onChange={onChangeStartDate} />
            <DatePicker size="smaller" label="End date" onChange={onChangeEndDate} />

            <SelectionWithLabel
                label="Học sinh"
                options={optionsStudent}
                initialValue="all-students"
            />
            <SelectionWithLabel
                label="Trạng thái"
                options={optionsStatus}
                initialValue="all-status"
            />

            <SquareButton color="blue" icon={Search} onClick={onFilter} />
        </div>
    )

}