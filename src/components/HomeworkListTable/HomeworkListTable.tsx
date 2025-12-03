import { Edit2, Send, Trash2 } from 'lucide-react';
import React from 'react'
import LoadingState from '../QueryState/LoadingState';
import ErrorState from '../QueryState/ErrorState';

type HomeworkListTableProps = {
    isLoading: boolean;
    isError: boolean;
    error: any;
    homeworkList: Homework[]
    onSelectAssignHomeworkToClass: (homework: Homework) => void;
    onSelectEditHomework: (homework: Homework) => void;
    onSelectDeleteHomework: (homework: Homework) => void;
    onViewHomeworkSubmissions: (homeworkId: string) => void;
}

export default function HomeworkListTable({
    isLoading, isError, error, homeworkList,
    onSelectAssignHomeworkToClass,
    onSelectEditHomework,
    onSelectDeleteHomework,
    onViewHomeworkSubmissions
}: HomeworkListTableProps) {
    if (isLoading) return <LoadingState message='Loading homework list...' />;
    if (isError) return <ErrorState message={error.message} />;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {homeworkList.map((hw) => (
                        <tr key={hw.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{hw.created_date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div onClick={() => onViewHomeworkSubmissions(hw.id)} className="cursor-pointer hover:underline hover:text-blue-600 text-sm font-medium text-gray-900">{hw.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hw.created_by_user_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button onClick={() => onSelectAssignHomeworkToClass(hw)} className="cursor-pointer flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-900">
                                    <Send size={16} /> Assign
                                </button>
                                <button onClick={() => onSelectEditHomework(hw)} className="cursor-pointer flex items-center justify-center gap-1.5 text-gray-600 hover:text-gray-900">
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => onSelectDeleteHomework(hw)} className="cursor-pointer flex items-center justify-center gap-1.5 text-red-600 hover:text-red-900">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}