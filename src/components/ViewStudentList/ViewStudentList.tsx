import { studentsSample } from "@/data_sample/studentsDataSample";
import SearchBar from "../SearchBar/SearchBar";
import TableStudentList from "../TableStudentList/TableStudentList";
import Button from "../Button/Button";
import { ListPlus, UserPlus } from "lucide-react";

export default function ViewStudentList() {
    const newStudent = () => {

    }

    const addStudentIntoClass = () => {

    }

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg py-6">
                <div className="px-4 flex flex-wrap items-center justify-between">
                    <h3 className="font-semibold text-base">Students List ({studentsSample.length})</h3>
                    <div className="flex flex-wrap items-center gap-1">
                        <SearchBar search_width_style="medium" />
                        <Button color="orange" onClick={newStudent} icon={UserPlus} title="New Student" />
                        <Button color="blue" onClick={addStudentIntoClass} icon={ListPlus} title="Add Student" />
                    </div>
                </div>

                <TableStudentList studentDatas={studentsSample} />
            </div>
        </div>
    )
}