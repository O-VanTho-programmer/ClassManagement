'use client';

import { classData } from "@/data_sample/classDataSample"
import SearchBar from "../SearchBar/SearchBar"
import Selection from "../Selection/Selection"
import TableClass from "../TableClass/TableClass"
import { useState } from "react"
import ToggleViewClassList from "../ToggleViewClassList/ToggleViewClassList";
import Button from "../Button/Button";
import { Search } from "lucide-react";

const statusOptions = ["Active", "Completed"]
const tuitionTypeOptions = ["Monthly", "Quarter", "Course", "Flexible"]

export default function ViewClass() {

    const [statusOption, setStatusOption] = useState<string>("");
    const [tuitionType, setTuitionType] = useState<string>("");
    const [isTableView, setIsTableView] = useState<boolean>(true);

    const handleFiler = () => {

    }

    return (
        <div className="container mt-8">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="pt-6 px-4 filter flex flex-wrap justify-between items-center">
                    <div className="flex gap-2">
                        <SearchBar search_width_style="small" />

                        <Selection onChange={(value) => setStatusOption(value)}
                            placeholder="Status" options={statusOptions} />
                        <Selection onChange={(value) => setTuitionType(value)}
                            placeholder="Tuition Type" options={tuitionTypeOptions} />

                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleFiler} icon={Search} title="Filter" />

                        <ToggleViewClassList isTableView={isTableView} setIsTableView={setIsTableView} />

                    </div>
                </div>

                <TableClass datas={classData} />
            </div>
        </div>
    )
}