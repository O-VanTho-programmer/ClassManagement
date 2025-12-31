import { Loader2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { updateTeacherAPI } from '@/lib/api/updateTeacher';
import { updateTeacherRoleInHub } from '@/lib/api/updateTeacherRoleInHub';
import Button from '../Button/Button';
import EditPermissionOfMemberModal from '../EditPermissionOfMemberModal/EditPermissionOfMemberModal';
import { updateUserPermissionInHub } from '@/lib/api/updateUserPermissionInHub';
import { HubRole } from '@/types/Hub';
import { useAlert } from '../AlertProvider/AlertContext';
import { useHasPermission } from '@/hooks/useHasPermission';

type EditRoleOfTeacherProps = {
    // isOpen: boolean;
    // onClose: () => void
    hubId: string;
    teachersList: TeacherInHub[];
    currentUserRole: 'Master' | 'Member' | 'Owner';
}

export default function EditRoleOfTeacher({
    // isOpen,
    // onClose,
    hubId,
    teachersList,
    currentUserRole
}: EditRoleOfTeacherProps) {

    const queryClient = useQueryClient();

    const {hasPermission: canEditRole} = useHasPermission(hubId, 'EDIT_MEMBER');

    const [searchTerm, setSearchTerm] = useState('');
    const { showAlert } = useAlert();

    const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<TeacherInHub | null>(null);

    const handleOpenEditPermissionModal = (teacher: TeacherInHub) => {
        setSelectedTeacherForEdit(teacher);
    };

    const updateRoleMutation = useMutation({
        mutationFn: ({ teacher, newRole }: { teacher: TeacherInHub, newRole: HubRole }) => {
            return updateTeacherRoleInHub(teacher.id, hubId, newRole);
        },
        onSuccess: () => {
            showAlert("Role updated successfully!", 'success');
            queryClient.invalidateQueries({ queryKey: ['teachers_workload', hubId] });
        },
        onError: (error: Error, variables) => {
            showAlert(`Failed to update role for ${variables.teacher.name}: ${error.message}`, 'error');
        }
    });

    const handleRoleChange = (teacher: TeacherInHub, newRole: HubRole) => {
        if (!canEditRole) {
            showAlert("You do not have permission to change roles.", 'error');
            return;
        }

        if (updateRoleMutation.isPending) return;

        console.log(teacher, { ...teacher, role_hub: newRole });

        updateRoleMutation.mutate({ teacher, newRole });
    };

    const handlePermissionChange = async (selectedPermissions: string[], teacherId: string, hubId: string) => {
        console.log(selectedPermissions, teacherId, hubId);
        const res = await updateUserPermissionInHub(selectedPermissions, teacherId, hubId);

        return res;
    }

    const filteredTeachers = useMemo(() => {
        return teachersList.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teachersList, searchTerm]);

    // const handleClose = () => {
    //     setSearchTerm('');
    //     onClose();
    // };
    return (
        <>
            <div className="bg-white rounded-xl w-full p-6 transform transition-all duration-300 scale-100 flex flex-col max-h-[70vh] mb-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Permission</h2>
                </div>

                {/* Search Input */}
                <div className="relative mt-6">
                    <SearchBar
                        search_width_style="header-dashboard"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="flex-grow overflow-y-auto mt-4">
                    {filteredTeachers && filteredTeachers.length > 0 && (
                        <ul className="divide-y divide-gray-200">
                            {filteredTeachers.map(teacher => {

                                // Check if this specific teacher is being updated
                                const isUpdatingThisTeacher: boolean =
                                    updateRoleMutation.isPending &&
                                    updateRoleMutation.variables?.teacher.id === teacher.id;

                                return (
                                    <li
                                        key={teacher.id}
                                        className={`p-3 cursor-pointer flex relative items-center hover:bg-gray-50 ${isUpdatingThisTeacher ? 'bg-gray-200' : ''}`}
                                    >
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                                            <p className="text-sm text-gray-500">{teacher.email}</p>
                                        </div>

                                        {teacher.role_hub === 'Owner' ? (
                                            <span className="absolute right-5 text-sm font-medium text-gray-500">Owner</span>
                                        ) : (
                                            <div className="absolute right-5 flex items-center space-x-2">
                                                <Button color='blue_off' title='Permission' onClick={() => handleOpenEditPermissionModal(teacher)} />

                                                <div>
                                                    {isUpdatingThisTeacher && (
                                                        <Loader2 size={16} className="animate-spin text-blue-600" />
                                                    )}
                                                    <select
                                                        value={teacher.role_hub}
                                                        onChange={(e) => handleRoleChange(teacher, e.target.value as 'Master' | 'Member' | 'Owner')}
                                                        disabled={
                                                            (currentUserRole !== 'Master' && currentUserRole !== 'Owner') ||
                                                            isUpdatingThisTeacher
                                                        }
                                                        className="cursor-pointer appearance-none bg-gray-100 border border-gray-300 text-gray-700 text-sm py-1.5 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        <option className='cursor-pointer' value="Member">Member</option>
                                                        <option className='cursor-pointer' value="Assistant">Assistant</option>
                                                        <option className='cursor-pointer' value="Teacher">Teacher</option>
                                                        <option className='cursor-pointer' value="Master">Master</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
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
            {
                selectedTeacherForEdit && (
                    <EditPermissionOfMemberModal
                        isOpen={selectedTeacherForEdit !== null}
                        onClose={() => setSelectedTeacherForEdit(null)}
                        hubId={hubId}
                        teacher={selectedTeacherForEdit}
                        onSave={(selectedPermissions, teacherId) => handlePermissionChange(selectedPermissions, teacherId, hubId)}
                    />
                )
            }
        </>
        // </div>
    )
}