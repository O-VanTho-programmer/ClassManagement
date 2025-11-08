import { CalendarIcon, CircleX, ClockIcon, CreditCardIcon, PlayIcon, UserIcon, UsersIcon } from "lucide-react";
import Badge from "../Badge/Badge";
import { ClassData } from "@/types/ClassData";

interface ViewCardClassItemProps {
    classData: ClassData
    onLinkToClassDetail: () => void,
}

export default function ViewCardClassItem({ classData, onLinkToClassDetail }: ViewCardClassItemProps) {
    // const diffTime = getDiffTimeFromStartToNow(classData.startDate);

    return (
        <div onClick={onLinkToClassDetail} className="cursor-pointer bg-white rounded-xl border border-gray-300 shadow-lg p-6 w-full max-w-xs">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {classData.status === "Finished" ? (
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-500">
                            <CircleX className="w-6 h-6" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-500">
                            <PlayIcon className="w-6 h-6" />
                        </div>
                    )}

                    <h2 className="text-lg font-bold">{classData.name}</h2>
                </div>

                {classData.status === "Finished" ? (
                    <Badge bg_clr="bg-green-500" title="Finished" />
                ) : (
                    <Badge bg_clr="bg-green-500" title="Active" />
                )}
            </div>

            {/* Details Section */}
            <div className="space-y-4 text-sm">
                <div className="">
                    <span className="flex items-center p-1 mb-1">
                        <CalendarIcon className="w-5 h-5 text-blue-500" /> Schedule:
                    </span>
                    <div className="flex flex-wrap gap-2 ml-auto">
                        {classData.schedule.map((item, index) => (
                            <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                                {item.day}({item.startTime} - {item.endTime})
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <UsersIcon className="w-5 h-5 text-yellow-500" />
                    <span>Class Size: <span className="font-semibold">{classData.studentCount} học sinh</span></span>
                </div>

                <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-5 h-5 text-purple-500" />
                    <span>Tuition Fee:</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full ml-auto">{classData.tuition}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-green-500" />
                    <span>Teacher:</span>
                    <span className="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">{classData.teacher}</span>
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <div className="text-center">
                    <span className="block mb-1">Start at</span>
                    <span className="block font-semibold text-gray-700">{classData.startDate}</span>
                </div>
                <div className="text-center">
                    <span className="block mb-1">End at</span>
                    <span className="block font-semibold text-gray-700">{classData.endDate}</span>
                </div>
            </div>

            {/* Timestamp */}
            <div className="mt-4 flex items-center justify-end text-xs text-gray-400">
                <ClockIcon className="w-4 h-4 mr-1" />
                {/* <span>{diffTime}</span> */}
                <div className="flex-1"></div>
                <button className="p-1 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}