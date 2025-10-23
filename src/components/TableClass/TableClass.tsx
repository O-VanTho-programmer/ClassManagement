import { ClassData } from "@/types/ClassData";
import SearchBar from "../SearchBar/SearchBar";
import Selection from "../Selection/Selection";
import TableClassRow from "../TableClassRow/TableClassRow";

export interface TableClassProps {
    datas: ClassData[] | null | undefined
}


export default function TableClass({ datas }: TableClassProps) {

    if(datas == null || datas == undefined) return ;

    return (
        <div className="mx-9 py-4 overflow-x-scroll">
            <table className="border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[5%]">#</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[20%]">CLASS</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">SIZE</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">TEACHER</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">ASSISTANT</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">SUBJECT</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">TUITION TYPE</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">CƠ SỞ</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">STATUS</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[5%]">ACTION</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {datas.map((data, index) => (
                        <TableClassRow key={data.id} data={data} index={index} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}