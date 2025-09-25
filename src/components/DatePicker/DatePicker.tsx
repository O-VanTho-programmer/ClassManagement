'use client'

import { CalendarDays } from "lucide-react";
import { useState } from "react";

interface DatePickerProps{
    onChange: (date: string) => void,
}

export default function DatePicker ({onChange} : DatePickerProps) {
    const [selectedDate, setSelectedDate] = useState('2025-09-25');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div>
            <div className="flex items-center text-blue-600 space-x-2 mb-4">
                <CalendarDays />
                <h2 className="text-lg font-semibold">Chọn ngày điểm danh</h2>
            </div>
            <div className="relative">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="bg-gray-100 rounded-xl px-4 py-3 w-full sm:w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                />
            </div>
        </div>
    );
};