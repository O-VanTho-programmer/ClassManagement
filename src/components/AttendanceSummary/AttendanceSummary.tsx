import { UserPlusIcon } from "lucide-react";

const AttendanceSummary = () => {
    const stats = [
        { title: 'Present', value: 0, color: 'text-green-600', bgColor: 'bg-green-50' },
        { title: 'Absent', value: 0, color: 'text-red-600', bgColor: 'bg-red-50' },
        { title: 'Late', value: 0, color: 'text-yellow-600', bgColor: 'bg-yellow-50'},
        { title: 'Excused', value: 0, color: 'text-blue-600', bgColor: 'bg-blue-50'},
    ];

    return (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <div className="flex items-center text-blue-600 space-x-2 mb-4">
                <UserPlusIcon />
                <h2 className="text-lg font-semibold">Attendance Summary</h2>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                {stats.map((stat, index) => {
                    return (
                        <div key={index} className={`
                        flex flex-col items-center justify-center p-4 rounded-xl ${stat.bgColor}`}>
                            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                            <span className={`text-sm ${stat.color}`}>{stat.title}</span>
                        </div>
                    );
                })}
            </div>
            {/* <p className="text-gray-700 text-sm">
                Total: <span className="font-semibold">1 students</span>
                <span className="float-right text-red-600 font-semibold">0%</span>
            </p> */}
        </div>
    );
};

export default AttendanceSummary;