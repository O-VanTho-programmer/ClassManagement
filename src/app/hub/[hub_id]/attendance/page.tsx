import ViewAttendance from "@/components/ViewAttendance/ViewAttendance";
import { CalendarCheck } from "lucide-react";

export default function AttendancesPage() {
    return (
        <>
            <div className="">
                <div className="py-3 lg:py-6">
                    <h1 className="flex items-center text-lg font-semibold"><CalendarCheck className="text-blue-500 mr-1" /> Take Attendance</h1>
                    <ul className="flex flex-row items-center bg-transparent text-gray-400 font-semibold">
                        <li className="text-sm"><a href="/">Home Page</a></li>
                        <li className="px-1">-</li>
                        <li className="text-[13px]">Attendance Management</li>
                    </ul>
                </div>
            </div>

            <ViewAttendance/>
        </>
    )
}