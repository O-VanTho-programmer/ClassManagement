import Badge from "../Badge/Badge";
import formatDisplayDate from "@/utils/Format/formatDisplayDate";

interface ClassesInfoCardProps {
    classData: ClassData;
    onClick?: (classData: ClassData) => void;
}


export default function ClassesInfoCard({ classData, onClick }: ClassesInfoCardProps) {

    const getTuitionConfig = (tuitionType: string) => {
        switch (tuitionType) {
            case 'Monthly': return { color: 'bg-blue-500' };
            case 'Quarter': return { color: 'bg-purple-500' };
            case 'Course': return { color: 'bg-green-500' };
            case 'Flexible': return { color: 'bg-yellow-500' };
            default: return { color: 'bg-gray-500' };
        }
    };

    const tuitionConfig = getTuitionConfig(classData.tuitionType);

    return (
        <div
            className={`
            bg-white rounded-xl shadow-sm border border-gray-200 p-6 
            transition-all duration-300 hover:shadow-md hover:border-gray-300
            cursor-pointer group
            ${classData.status === 'finished' ? 'opacity-70' : ''}
          `}
            onClick={() => onClick?.(classData)}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {classData.name}
                </h3>
                {classData.status === "finished" ? (
                    <Badge bg_clr="bg-red-500" title="Finished" />
                ) : (
                    <Badge bg_clr="bg-green-500" title="Active" />
                )}
            </div>

            {/* Subject and Teacher */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">{classData.subject}</span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    👨‍🏫 {classData.teacher}
                </span>
            </div>

            {/* Schedule */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Schedule</h4>
                <div className="space-y-2">
                    {classData.schedule.map((session, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700">{session.day}</span>
                            <span className="text-gray-500">{session.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium text-gray-700 flex items-center gap-1">
                        👥 {classData.studentCount}
                    </span>
                </div>

                {classData.assistant && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Assistant:</span>
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                            👨‍💻 {classData.assistant}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-700 text-right">
                        {formatDisplayDate(classData.startDate)} - {formatDisplayDate(classData.endDate)}
                    </span>
                </div>
            </div>

            {/* Tuition Information */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Badge bg_clr={`${tuitionConfig.color}`} title={classData.tuitionType}/>

                {classData.tuition && (
                    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        💰 {classData.tuition}
                    </span>
                )}
            </div>

            {/* Base Information */}
            {classData.base && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">Base: {classData.base}</p>
                </div>
            )}
        </div>
    );
}