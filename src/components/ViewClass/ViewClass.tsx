'use client';

import Selection, { Option } from "../Selection/Selection"
import TableClass from "../TableClass/TableClass"
import { useEffect, useMemo, useState } from "react"
import ToggleViewClassList from "../ToggleViewClassList/ToggleViewClassList";
import Button from "../Button/Button";
import { Plus, Search } from "lucide-react";
import ViewCardClasses from "../ViewCardClasses/ViewCardClasses";
import CreateClassModal from "../CreateClassModal/CreateClassModal";
import api from "@/lib/axios";
import { useAlert } from "../AlertProvider/AlertContext";
import { useGetUserClassesQuery } from "@/hooks/useGetUserClassesQuery";
import { useParams } from "next/navigation";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import type { ClassData } from "@/types/ClassData";
import { useQueryClient } from "@tanstack/react-query";

const statusOptions: Option[] = [
    {
        label: "Active",
        value: "Active"
    },
    {
        label: "Finished",
        value: "Finished"
    }
]
const tuitionTypeOptions: Option[] = [
    {
        label: "Monthly",
        value: "Monthly"
    },
    {
        label: "Quarter",
        value: "Quarter"
    },
    {
        label: "Course",
        value: "Course"
    },
    {
        label: "Flexible",
        value: "Flexible"
    },
]

export default function ViewClass() {

    const { showAlert } = useAlert();
    const { hub_id } = useParams();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusOption, setStatusOption] = useState<string>("");
    const [tuitionType, setTuitionType] = useState<string>("");
    const [isTableView, setIsTableView] = useState<boolean>(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: classData = [], isLoading, isError, error } = useGetUserClassesQuery(hub_id as string);
    const queryClient = useQueryClient();

    const filteredClasses = useMemo(() => {
        return classData.filter(classItem => {
            const matchesStatus = !statusOption || classItem.status === statusOption;
            const matchesTuition = !tuitionType || classItem.tuitionType === tuitionType;

            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm ||
                classItem.name.toLowerCase().includes(lowerSearchTerm) ||
                classItem.subject.toLowerCase().includes(lowerSearchTerm) ||
                classItem.teacher.toLowerCase().includes(lowerSearchTerm) ||
                (classItem.assistant && classItem.assistant.toLowerCase().includes(lowerSearchTerm));

            return matchesStatus && matchesTuition && matchesSearch;
        });
    }, [classData, statusOption, tuitionType, searchTerm]);



    const handleCreateClass = async (newClassData: Omit<ClassData, 'id'>) => {
        try {
            const res = await api.post('new_class', newClassData);

            const newClass: ClassData = {
                ...newClassData,
                id: res.data.id,
            };

            // Update cache for classes of this hub
            queryClient.setQueryData<ClassData[]>(['userClasses', hub_id], (prev = []) => [
                newClass,
                ...prev,
            ]);
            setIsCreateModalOpen(false);

            if (res.status === 200) {
                showAlert(res.data.message, 'success');
            } else {
                showAlert(res.data.message, 'error');
            }
        } catch (error) {
            console.error("Failed to create class:", error);
        }
    };

    if (isLoading) return <LoadingState fullScreen message="Loading your classes..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Classes"
            message={error?.message || "Something went wrong while loading your classes. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg py-6">
                <div className="px-4 filter flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:w-64"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <Selection onChange={(value) => setStatusOption(value)}
                            placeholder="Status" options={statusOptions} />
                        <Selection onChange={(value) => setTuitionType(value)}
                            placeholder="Tuition Type" options={tuitionTypeOptions} />

                    </div>
                    <div className="flex gap-2 items-center">
                        <Button color="blue" onClick={() => setIsCreateModalOpen(true)} icon={Plus} title="Create Class" />
                        <ToggleViewClassList isTableView={isTableView} setIsTableView={setIsTableView} />

                    </div>
                </div>

                {filteredClasses.length > 0 ? (
                    isTableView ? (
                        <TableClass datas={filteredClasses} />

                    ) : (
                        <ViewCardClasses datas={filteredClasses} />
                    )
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-2">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>

                        <Button color="blue" icon={Plus} onClick={() => setIsCreateModalOpen(true)} title="Create Class" />
                    </div>
                )}

            </div>

            <CreateClassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateClass}
            />
        </div>
    )
}