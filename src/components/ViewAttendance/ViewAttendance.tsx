'use client';

import { useParams } from "next/navigation";
import SearchBar from "../SearchBar/SearchBar";
import TableAttendance from "../TableAttendance/TableAttendance";
import { useGetUserClassesQuery } from "@/hooks/useGetUserClassesQuery";


export default function ViewAttendance() {

    const { hub_id } = useParams();

    const { data: classData = [], isLoading, isError, error } = useGetUserClassesQuery(hub_id as string);
    
    if(classData == null || classData == undefined) return ;

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg py-6">
                <div className="px-4">
                    <SearchBar search_width_style="small" />
                </div>

                <TableAttendance datas={classData} />
            </div>
        </div>
    )

}