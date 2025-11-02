import { X } from "lucide-react";
import React from "react";
import AddTeacherToHubModal from "../AddTeacherToHubModal/AddTeacherToHubModal";
import EditRoleOfTeacherModal from "../EditRoleOfTeacherModal/EditRoleOfTeacherModal";

interface ManagementTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    hub_id: string;
    teachers: TeacherWorkload[];
    isLoadingTeachers?: boolean;
}

export default function ManagementTeacherModal({
    isOpen,
    onClose,
    hub_id,
    teachers,
    isLoadingTeachers = false
}: ManagementTeacherModalProps) {
    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-4 transform transition-all duration-300 scale-100 flex flex-col overflow-y-scroll max-h-[70vh]"
            >
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Manage</h2>
                    <button onClick={handleClose} className="cursor-pointer p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <AddTeacherToHubModal
                    // isOpen={isAddModalOpen}
                    // onClose={() => setAddModalOpen(false)}
                    hubId={hub_id as string}
                    teachersInHub={teachers}
                />

                <EditRoleOfTeacherModal
                    hubId={hub_id as string}
                    currentUserRole="Master"
                    teachersList={teachers}
                />
            </div>
        </div>
    );
}