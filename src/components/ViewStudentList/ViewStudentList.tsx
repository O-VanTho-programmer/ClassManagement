import SearchBar from "../SearchBar/SearchBar";
import TableStudentList from "../TableStudentList/TableStudentList";
import Button from "../Button/Button";
import { ListPlus, UserPlus, Users } from "lucide-react";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import { useParams } from "next/navigation";
import { useHasPermission } from "@/hooks/useHasPermission";
import { useState } from "react";
import { Invoice } from "@/lib/api/fetchClassInvoices";

interface ViewStudentListProps {
    studentDatas: StudentWithEnrollment[] | [] | undefined ;
    invoices?: Invoice[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    newStudent: () => void;
    addStudentIntoClass: () => void;
}

export default function ViewStudentList({
    studentDatas=[], 
    invoices=[],
    isLoading, isError, error, 
    newStudent,
    addStudentIntoClass, 
}: ViewStudentListProps) {
    const { hub_id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    
    const { hasPermission: canCreateStudent } = useHasPermission(hub_id as string, "CREATE_STUDENT");
    const { hasPermission: canAddStudentIntoClass } = useHasPermission(hub_id as string, "ADD_STUDENT_CLASS");


    if (isLoading) {
        return <LoadingState fullScreen message="Loading your students..." />;
    }

    if (isError) {
        return (
            <ErrorState 
                message={error?.message || "Something went wrong while loading your students. Please try again."} 
                onRetry={() => window.location.reload()} 
            />
        );
    }

    const filteredStudentDatas = studentDatas.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/70 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-500" />
                        <h3 className="font-bold text-slate-800 text-base">
                            Enrolled Students 
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                                {filteredStudentDatas.length}
                            </span>
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <SearchBar 
                            search_width_style="medium" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                            style={!canCreateStudent ? 'hide' : ''} 
                            color="orange" 
                            onClick={newStudent} 
                            icon={UserPlus} 
                            title="New Student" 
                        />
                        <Button 
                            style={!canAddStudentIntoClass ? 'hide' : ''} 
                            color="blue" 
                            onClick={addStudentIntoClass} 
                            icon={ListPlus} 
                            title="Add Student" 
                        />
                    </div>
                </div>

                <TableStudentList studentDatas={filteredStudentDatas} invoices={invoices} />
            </div>
        </div>
    );
}