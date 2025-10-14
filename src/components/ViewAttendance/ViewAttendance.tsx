'use client';

import { classData } from "@/data_sample/classDataSample";
import SearchBar from "../SearchBar/SearchBar";
import TableAttendance from "../TableAttendance/TableAttendance";


export default function ViewAttendance() {

    
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