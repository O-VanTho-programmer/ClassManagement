'use client'

import {LucideIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerProps{
    date?: string,
    onChange: (date: string) => void,
    icon?: LucideIcon,
    label: string,
    size? : "smaller"
}

export default function DatePicker ({date, onChange, icon, label, size} : DatePickerProps) {
    console.log(date);
    const [selectedDate, setSelectedDate] = useState(date ??'2025-09-25');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        onChange(event.target.value);
    };

    const Icon = icon ?? null;

    const widthClass = size === 'smaller' ? 'w-64 md:w-48' : 'w-full sm:w-64';

    return (
        <div className="relative">
            <div className="absolute -top-6 left-0 text-sm font-medium text-gray-500">
                {label}
            </div>
            <div className={`relative ${widthClass}`}>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="bg-gray-50 rounded-lg px-4 py-2 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 shadow-sm"
                />
            </div>
        </div>
    );
};