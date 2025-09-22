import { EllipsisVertical, GraduationCap, StarIcon, Users } from "lucide-react";
import Badge from "../Badge/Badge";

interface TableClassRowProps {
    data: ClassData;
    index: number;
}

export default function TableClassRow({ data, index }: TableClassRowProps) {
    return (
        <tr className="border-b border-gray-200 text-sm">
            <td className="py-4 px-2 whitespace-nowrap text-gray-800 flex items-center space-x-2">
                <span>{index}</span>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="font-medium text-gray-800">{data.name}</p>
                        <p className="text-gray-500">{data.schedule}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2 whitespace-nowrap text-gray-800">
                <div className="flex items-center space-x-1">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">{data.count}</span>
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
                <Badge bg_clr="bg-yellow-500" title={data.tuition} />
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

