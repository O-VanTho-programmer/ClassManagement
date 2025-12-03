import { BookIcon, CalendarIcon, ChevronDownIcon, DollarSignIcon, UserIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import Badge from "../Badge/Badge";
import { ClassData } from "@/types/ClassData";

interface ClassHeaderProps {
    classInfo: ClassData | undefined | null;
}

export default function ClassHeader({ classInfo }: ClassHeaderProps) {
    const [showFullDetails, setShowFullDetails] = useState(false);

    if(classInfo === null || classInfo === undefined){
        return null;
    }

    return (
        <div className="flex flex-col w-full py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg shadow-xl"
                style={{
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                }}>
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{classInfo.name}</h2>
                        <div className="flex flex-wrap items-center space-x-2 my-2">
                            {classInfo.status === "Finished" ? (
                                <Badge bg_clr="bg-green-500" title="Finished" />
                            ) : (
                                <Badge bg_clr="bg-green-500" title="Active" />
                            )}

                            <Badge bg_clr="bg-[#ffffff42]" title={`${classInfo.studentCount} students`} />
                            <Badge bg_clr="bg-[#ffffff42]" title={`${classInfo.schedule?.length} times/week`} />
                        </div>
                        <p className="mt-2 text-sm text-white">
                            Teacher: <span className="font-semibold">{classInfo.teacher}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className={`bg-white rounded-lg shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${showFullDetails ? 'max-h-screen opacity-100 p-6 mt-6' : 'max-h-0 opacity-0 p-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Schedule:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {classInfo.schedule?.map((session, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                        {session.day}({session.startTime} - {session.endTime})
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <UsersIcon className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Number of Students:</p>
                            <p className="font-semibold mt-1">{classInfo.studentCount} students</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <DollarSignIcon className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Tuition Type:</p>
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">{classInfo.tuitionType}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Teacher:</p>
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">{classInfo.teacher}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col sm:flex-row justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Start date</p>
                        <p className="font-semibold mt-1">{classInfo.startDate}</p>
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0">
                        <p className="text-sm text-gray-500">End date</p>
                        <p className="font-semibold mt-1">{classInfo.endDate}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="flex items-center justify-center text-xl text-gray-400 hover:bg-gray-300 focus:outline-none transition-all duration-300 cursor-pointer">
                <span
                    className="p-1 rounded-full text-sm flex items-center gap-2">
                        {showFullDetails ? 'View Less' : 'View More'}
                    <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showFullDetails ? 'rotate-180' : ''}`} />
                </span>
            </button>
        </div>
    );
}