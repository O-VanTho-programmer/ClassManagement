import { Filter, X } from "lucide-react"
import Button from "../Button/Button"
import DatePicker from "../DatePicker/DatePicker"

interface AttendanceGridFilterProps{
    startDate?: string,
    endDate?: string,
}

export default function AttendanceGridFilter({startDate, endDate}: AttendanceGridFilterProps) {
    const onChangeStartDate = () => {

    }

    const onChangeEndDate = () => {

    }

    const handleFilter = () => {

    }

    const handleResetFilter = () => {

    }

    return (
        <div className="bg-white shadow-md rounded-xl pt-10 p-6 flex items-center gap-2 mb-6">
            <DatePicker size="smaller" label="Start date" onChange={onChangeStartDate} date={startDate} />
            <DatePicker size="smaller" label="End date" onChange={onChangeEndDate} date={endDate} />

            <div className="flex items-center gap-2">
                <Button color="blue" icon={Filter} title="Filter" onClick={handleFilter} /> 
                <Button color="gray" icon={X} title="Reset" onClick={handleResetFilter} />
            </div>
        </div>
    )
}