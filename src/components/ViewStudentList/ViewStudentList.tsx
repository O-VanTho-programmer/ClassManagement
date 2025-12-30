import SearchBar from "../SearchBar/SearchBar";
import TableStudentList from "../TableStudentList/TableStudentList";
import Button from "../Button/Button";
import { ListPlus, UserPlus } from "lucide-react";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import { useParams } from "next/navigation";
import { useHasPermission } from "@/hooks/useHasPermission";

interface ViewStudentListProps {
    studentDatas: StudentWithEnrollment[] | [] | undefined ;
    isLoading: boolean;
    isError: boolean;
    error: any;
    newStudent: () => void;
    addStudentIntoClass: () => void;
}

export default function ViewStudentList({
    studentDatas=[], 
    isLoading, isError, error, 
    newStudent,
    addStudentIntoClass, 
}: ViewStudentListProps) {

    if(isLoading){
        <LoadingState fullScreen message="Loading your students..." />
    }

    if(isError){
        <ErrorState message={error?.message || "Something went wrong while loading your students. Please try again."} onRetry={() => window.location.reload()} />
    }

    const {hub_id} = useParams();
    const {hasPermission: canCreateStudent} = useHasPermission(hub_id as string, "CREATE_STUDENT");
    const {hasPermission: canAddStudentIntoClass} = useHasPermission(hub_id as string, "ADD_STUDENT_CLASS");

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg py-6">
                <div className="px-4 flex flex-wrap items-center justify-between">
                    <h3 className="font-semibold text-base">Students List ({studentDatas.length})</h3>
                    <div className="flex flex-wrap items-center gap-1">
                        <SearchBar search_width_style="medium" />
                        <Button style={!canCreateStudent ? 'hide' : ''} color="orange" onClick={newStudent} icon={UserPlus} title="New Student" />
                        <Button style={!canAddStudentIntoClass ? 'hide' : ''} color="blue" onClick={addStudentIntoClass} icon={ListPlus} title="Add Student" />
                    </div>
                </div>

                <TableStudentList studentDatas={studentDatas} />
            </div>
        </div>
    )
}