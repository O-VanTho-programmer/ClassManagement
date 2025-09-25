'use client';

import CardDirection, { CardDirectionProps } from "@/components/CardDirection/CardDirection";
import ClassHeader from "@/components/ClassHeader/ClassHeader";
import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";
import ViewStudentList from "@/components/ViewStudentList/ViewStudentList";
import { classData } from "@/data_sample/classDataSample";
import { Album, CalendarCheck, Pen, PenBox, QrCode } from "lucide-react";

export default function Class() {

    const cardData: CardDirectionProps[] = [
        {
            icon: CalendarCheck,
            title: "Attendance",
            descr: "Take attendance",
            bg_clr: 'green',
            onClick: () => { window.location.href = '/classes' },
        },
        {
            icon: Pen,
            title: "Homework",
            descr: "Create homework",
            bg_clr: 'blue',
            onClick: () => { return null },
        },
        {
            icon: Album,
            title: "Lesson Plan",
            descr: "Planning your lesson",
            bg_clr: 'red',
            onClick: () => { return null },
        },
        {
            icon: QrCode,
            title: "QR Code",
            descr: "QR code for qick attendance",
            bg_clr: 'yellow',
            onClick: () => { return null }
        },
    ];

    return (
        <LayoutDashboard>
            <ClassHeader classInfo={classData[1]} />

            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cardData.map((card, index) => (
                    <CardDirection
                        key={index}
                        title={card.title}
                        descr={card.descr}
                        bg_clr={card.bg_clr}
                        icon={card.icon}
                        onClick={card.onClick}
                    />
                ))}
            </div>

            <ViewStudentList/>
        </LayoutDashboard >
    )
}