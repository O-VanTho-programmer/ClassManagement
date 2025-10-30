import { X } from 'lucide-react';
import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import { useQueryClient } from '@tanstack/react-query';
import { updateTeacherAPI } from '@/lib/api/updateTeacher';
import { updateTeacherRoleInHub } from '@/lib/api/updateTeacherRoleInHub';

type EditRoleOfTeacherModalProps = {
    // isOpen: boolean;
    // onClose: () => void
    hubId: string;
    teachersList: TeacherInHub[];
    currentUserRole: 'Master' | 'Member' | 'Owner';
}

export default function EditRoleOfTeacherModal({
    // isOpen,
    // onClose,
    hubId,
    teachersList,
    currentUserRole
}: EditRoleOfTeacherModalProps) {

    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = async (teacher: TeacherInHub, newRole: 'Master' | 'Member' | 'Owner') => {
        if (currentUserRole !== 'Master' && currentUserRole !== 'Owner') {
            alert("You do not have permission to change roles.");
            return;
        }

        const updatedTeacher = {
            ...teacher,
            role_hub: newRole
        }

        console.log(teacher, updatedTeacher);
        await updateTeacherRoleInHub(updatedTeacher.id, hubId, newRole);
    };

    // const handleClose = () => {
    //     setSearchTerm('');
    //     onClose();
    // };
    return (
        // <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
        <div className="bg-white rounded-xl w-full max-w-xl p-6 transform transition-all duration-300 scale-100 flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Permission</h2>
                {/* <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button> */}
            </div>

            {/* Search Input */}
            <div className="relative mt-6">
                <SearchBar
                    search_width_style="header-dashboard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Results List */}
            <div className="flex-grow overflow-y-auto mt-4">
                {teachersList && teachersList.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {teachersList.map(teacher => {
                            return (
                                (
                                    <li
                                        key={teacher.id}
                                        className={`p-3 cursor-pointer flex relative items-center hover:bg-gray-50`}
                                    >

                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                                            <p className="text-sm text-gray-500">{teacher.email}</p>
                                        </div>
                                        {teacher.role_hub === 'Owner' ? (
                                            <span className="absolute right-5 text-sm font-medium text-gray-500">Owner</span>
                                        ) : (
                                            <select
                                                value={teacher.role_hub}
                                                onChange={(e) => handleRoleChange(teacher, e.target.value as 'Master' | 'Member' | 'Owner')}
                                                // Disable if not Master/Owner, or if mutation is pending for this teacher
                                                disabled={
                                                    (currentUserRole !== 'Master' && currentUserRole !== 'Owner')
                                                }
                                                className="absolute right-5 appearance-none bg-gray-100 border border-gray-300 text-gray-700 text-sm py-1.5 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                <option value="Master">Master</option>
                                                <option value="Member">Member</option>
                                            </select>
                                        )}

                                    </li>
                                )
                            )
                        })}
                    </ul>
                )}
            </div>
            {/* <div className="pt-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Done
                        </button>
                    </div>
                </div> */}
        </div>
        // </div>
    )
}