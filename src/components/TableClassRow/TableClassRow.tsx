'use client';

import { CalendarCheck, ChartArea, EllipsisVertical, GraduationCap, ListCheck, StarIcon, Users } from "lucide-react";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import { useParams, useRouter } from "next/navigation";
import { ClassData } from "@/types/ClassData";

interface TableClassRowProps {
    data: ClassData;
    index: number;
    type?: 'class' | 'attendance',
}

export default function TableClassRow({ data, index, type }: TableClassRowProps) {

    if (type === 'attendance') {
        return (
            <TableClassRowForAttendance data={data} index={index} />
        )
    }

    return (

        <TableClassRowForClasses data={data} index={index} />
    )
}

function TableClassRowForClasses({ data, index }: TableClassRowProps) {

    const router = useRouter();
    const params = useParams();
    const hub_id = params.hub_id;

    const directToClassDetail = (classId: string) => {
        router.push(`classes/${classId}`);
    }

    return (
        <tr onClick={() => directToClassDetail(data.id)} className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800 flex items-center space-x-2">
                <span>{index}</span>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800 group cursor-pointer">
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-gray-800 group-hover:text-blue-600">{data.name}</p>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-1">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">{data.studentCount}</span>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-blue-500" title={data.teacher} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                {data.assistant ? (
                    <Badge bg_clr="bg-blue-500" title={data.assistant} />

                ) : (
                    <p>-</p>
                )}
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-blue-500" title={data.subject} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-yellow-500" title={data.tuitionType} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                {data.base ? (
                    <Badge bg_clr="bg-blue-500" title={data.base} />

                ) : (
                    <p>-</p>
                )}
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-green-500" title={data.status} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex justify-end">
                    <button>
                        <EllipsisVertical className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </td>
        </tr>
    )
}


function TableClassRowForAttendance({ data, index }: TableClassRowProps) {
    const router = useRouter();
    const params = useParams();
    const hub_id = params.hub_id;
    
    const TakeAttendance = () => {
        router.push(`attendance/${data.id}/grid`);
    }

    const DirectToAttendanceReport = () => {
        router.push(`attendance/${data.id}/report`);
    }

    const DirectToAttendanceList = () => {
        router.push(`attendance/${data.id}/list`);
    }

    return (
        <tr className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800 flex items-center space-x-2">
                <span>{index}</span>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <p className="font-medium text-gray-800">{data.name}</p>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-1">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">{data.studentCount}</span>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-blue-500" title={data.subject} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-yellow-500" title={data.tuitionType} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <Badge bg_clr="bg-green-500" title={data.status} />
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex justify-end gap-1">
                    <Button color="blue_off" onClick={DirectToAttendanceList} icon={ListCheck} title="Attendance Logs" />
                    <Button color="blue_off" onClick={TakeAttendance} icon={CalendarCheck} title="Take Attendance" />
                    <Button color="green_off" onClick={DirectToAttendanceReport} icon={ChartArea} title="Report" />
                </div>
            </td>
        </tr>
    )
}