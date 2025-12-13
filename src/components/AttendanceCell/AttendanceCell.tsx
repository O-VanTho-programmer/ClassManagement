import formatDisplayDate from "@/utils/Format/formatDisplayDate";
import { Check, Edit3, X } from "lucide-react";

interface AttendanceCellProps {
    record: AttendanceRecord; 
    onEdit: (record: AttendanceRecord) => void;
}

export default function AttendanceCell ({ record, onEdit }: AttendanceCellProps) {
    // Only pass AttendanceRecord interface structure to onEdit
    const recordToPass: AttendanceRecord = {
        present: record.present as StudentAttendanceType,
        score: record.score,
        assignments: record.assignments,
        comment: record.comment,
        date: record.date,
        is_homework: record.is_homework
    };

    const handleClick = () => onEdit(recordToPass);

    let content;
    let iconClass = "w-6 h-6 mx-auto flex items-center justify-center p-1 rounded-full cursor-pointer transition-colors";

    switch (record.present) {
        case 'Present':
            content = <Check className="w-4 h-4 text-green-500" />;
            iconClass += " hover:bg-green-50";
            break;
        case 'Absent':
            content = <X className="w-4 h-4 text-red-500" />;
            iconClass += " hover:bg-red-50";
            break;
        case 'Late':
            content = <Check className="w-4 h-4 text-yellow-500" />;
            iconClass += " hover:bg-orange-50";
            break;
        case 'Excused':
            content = <X className="w-4 h-4 text-blue-500" />;
            iconClass += " hover:bg-blue-50";
            break;
        default:
            content = <Edit3 className="w-4 h-4 text-gray-400" />;
            iconClass += " hover:bg-gray-100";
            break;
    }

    return (
        <td className="py-2 px-2 border-l border-gray-100">
            <div className={iconClass} onClick={handleClick} title={`Attendance for ${formatDisplayDate(record.date)}`}>
                {content}
            </div>
        </td>
    );
};
