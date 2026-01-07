'use client';

import { useAlert } from "@/components/AlertProvider/AlertContext";
import EditClassModal from "@/components/ClassManagement/EditClassModal/EditClassModal";
import IconButton from "@/components/IconButton/IconButton";
import LoadingState from "@/components/QueryState/LoadingState";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useGetClassesByHubIdQuery } from "@/hooks/useGetClassesByHubIdQuery";
import { useGetTeacherListByHubId } from "@/hooks/useGetTeacherListByHubId";
import { useUpdateClassMutation } from "@/hooks/updateClassMutation";
import { ClassData } from "@/types/ClassData";
import { Edit, School } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ClassManagementPageContent() {
    const { hub_id } = useParams();
    const { showAlert } = useAlert();

    const [searchTerm, setSearchTerm] = useState('');
    const [editingClass, setEditingClass] = useState<ClassData | null>(null);

    const { data: classes = [], isLoading: isLoadingClasses } = useGetClassesByHubIdQuery(hub_id as string);
    const { data: teachers = [] } = useGetTeacherListByHubId(hub_id as string);
    const updateClassMutation = useUpdateClassMutation(hub_id as string, () => {
        setEditingClass(null);
    });

    const filteredClasses = useMemo(() => {
        return classes.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.teacher.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [classes, searchTerm]);

    if (isLoadingClasses) {
        return <LoadingState message="Loading classes..." fullScreen={true} />
    }

    const handleSaveEditClassInfo = async (classData: ClassData) => {
        await updateClassMutation.mutateAsync({ updatedClass: classData });
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
                    <p className="text-gray-500 mt-1">Manage which teachers are assigned to which classes.</p>
                </div>

                <div className="relative">
                    <SearchBar
                        search_width_style="medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-scroll">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Main Teacher</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assistant</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClasses.map((cls) => (
                            <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <School size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 mb-1">{cls.name}</div>
                                            <div className="text-xs text-gray-500">
                                                <div className="mb-1">
                                                    {cls.studentCount} Students
                                                </div>
                                                <div className="">
                                                    {cls.schedule?.map((session, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mr-1">
                                                            {session.day}({session.startTime} - {session.endTime})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {cls.teacher ? (
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 mr-2">
                                                {cls.teacher.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{cls.teacher}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Unassigned
                                        </span>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    {cls.assistant ? (
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 mr-2">
                                                {cls.assistant.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-700">{cls.assistant}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">None</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <IconButton
                                        icon={Edit}
                                        size={18}
                                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                        onClick={() => setEditingClass(cls)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredClasses.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        No classes found matching your search.
                    </div>
                )}
            </div>

            {editingClass && (
                <EditClassModal
                    isOpen={!!editingClass}
                    onClose={() => setEditingClass(null)}
                    editingClass={editingClass}
                    teacherList={teachers}
                    onSubmit={handleSaveEditClassInfo}
                    isSavingEdit={updateClassMutation.isPending}
                />
            )}
        </div>
    );
}
