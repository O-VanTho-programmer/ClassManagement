import React from 'react'
import LoadingState from '../QueryState/LoadingState';
import ErrorState from '../QueryState/ErrorState';
import { Book, Edit, Users } from 'lucide-react';

type Props = {
    teacherDatas: TeacherWorkload[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    handleOpenEditModal: (teacher: TeacherInHub) => void;
}

export default function TeacherListTable({
    teacherDatas,
    isLoading,
    isError,
    error,
    handleOpenEditModal,
}: Props) {
    if (isLoading) return <LoadingState fullScreen message="Loading your hubs..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Hubs"
            message={error?.message || "Something went wrong while loading your hubs. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    if (teacherDatas.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <h3 className="text-lg font-semibold">No Teachers Found</h3>
                <p>No teachers match your search, or no teachers have been added yet.</p>
            </div>
        );
    }

    // --- The Main Teacher Workload Table ---
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {teacherDatas.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-blue-700">{teacher.name.charAt(0)}</span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                        <div className="text-sm text-gray-500">{teacher.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.role_hub === 'Member' ? 'bg-green-100 text-green-800' :
                                    teacher.role_hub === "Master" ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                    {teacher.role_hub === "Master" ? "Master" : teacher.role_hub.charAt(0).toUpperCase() + teacher.role_hub.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                    <Book size={16} className="text-gray-400 mr-2" />
                                    <span>{teacher.classCount} {teacher.classCount === 1 ? 'Class' : 'Classes'}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <Users size={16} className="text-gray-400 mr-2" />
                                    <span>{teacher.studentCount} {teacher.studentCount === 1 ? 'Student' : 'Students'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleOpenEditModal({
                                        id: teacher.id,
                                        name: teacher.name,
                                        email: teacher.email,
                                        role_hub: teacher.role_hub
                                    })}
                                    className="flex items-center text-blue-600 hover:text-blue-900">
                                    <Edit size={16} className="mr-1" /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}