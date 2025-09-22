import formatDate from "@/utils/Format/formatDate";
import formatTime from "@/utils/Format/formateTime";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CurrentDate() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
            <div className="bg-blue-50 py-2 px-4 rounded-[50rem] flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 p-1 rounded-xl">
                        <CalendarIcon className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{formatDate(currentDateTime)}</span>
                </div>
                <div className="text-base font-bold text-blue-600">{formatTime(currentDateTime)}</div>
            </div>
    );
}