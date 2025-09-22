import SearchBar from "../SearchBar/SearchBar";
import Selection from "../Selection/Selection";
import TableClassRow from "../TableClassRow/TableClassRow";

interface TableClassProps {
    datas: ClassData[]
}


export default function TableClass({ datas }: TableClassProps) {
    return (
        <div className="mx-9 py-4 overflow-x-scroll">
            <table className="border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[5%]">#</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[20%]">TÊN LỚP</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">SĨ SỐ</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">GIÁO VIÊN</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">TRỢ GIẢNG</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">MÔN HỌC</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">THU PHÍ</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">CƠ SỞ</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-[10%]">TRẠNG THÁI</th>
                        <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[5%]">THAO TÁC</th>
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