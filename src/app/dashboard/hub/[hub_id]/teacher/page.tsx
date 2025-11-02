'use client';

import Button from "@/components/Button/Button";
import ManagementTeacherModal from "@/components/ManageTeacherModal/ManagementModal";
// import EditTeacherModal from "@/components/EditTeacherModal/EditTeacherModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import TeacherListTable from "@/components/TeacherListTable/TeacherListTable";
import { useGetTeachersWorkload } from "@/hooks/useGetTeacherWorkload";
import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function TeacherPage() {
    const { hub_id } = useParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<TeacherInHub | null>(null);

    const { data: teachers = [], isLoading, isError, error } = useGetTeachersWorkload(hub_id as string);

    // --- Memoized Filtering ---
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teachers, searchTerm]);


    const handleOpenEditModal = (selectedTeacher: TeacherInHub) => {
        setSelectedTeacherForEdit(selectedTeacher);
    };

    const handleCloseEditModal = () => {
        setSelectedTeacherForEdit(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Management</h1>

            {/* Header / Action Bar */}
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchBar
                    search_width_style="medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Button onClick={() => setAddModalOpen(true)} color="blue" icon={UserPlus} title="Add & Permission" />
            </div>

            {/* Main Content Table */}
            <div className="bg-white rounded-xl shadow-lg">
                <TeacherListTable
                teacherDatas={filteredTeachers}
                isLoading={isLoading}
                isError={isError}
                error={error}
                handleOpenEditModal={handleOpenEditModal}
                />
            </div>

            {/* Modals */}
           <ManagementTeacherModal
           isOpen={isAddModalOpen}
           onClose={() => setAddModalOpen(false)}
           hub_id={hub_id as string}
           teachers={teachers}
           isLoadingTeachers={isLoading}
           />

            {/* {selectedTeacherId && (
                <EditTeacherModal
                    isOpen={selectedTeacherForEdit !== null}
                    onClose={handleCloseEditModal}
                    teacherId={selectedTeacherForEdit}
                    hubId={hub_id as string}
                />
            )} */}
        </div>
    );
}