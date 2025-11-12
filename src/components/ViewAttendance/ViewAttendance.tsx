'use client';

import { useParams } from "next/navigation";
import SearchBar from "../SearchBar/SearchBar";
import TableAttendance from "../TableAttendance/TableAttendance";
import { useGetClassesByHubIdQuery } from "@/hooks/useGetClassesByHubIdQuery";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";


export default function ViewAttendance() {

    const { hub_id } = useParams();

    const { data: classData = [], isLoading, isError, error } = useGetClassesByHubIdQuery(hub_id as string);
    
    if(classData == null || classData == undefined) return ;

    if (isLoading) return <LoadingState/>;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading View Attendance"
            message={error?.message}
            onRetry={() => window.location.reload()}
        />
    );

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