'use client';
import React from "react";
import AddTeacherToHubModal from "../../../../../../components/AddTeacherToHubModal/AddTeacherToHubModal";
import { useParams } from "next/navigation";
import { useGetTeachersWorkload } from "@/hooks/useGetTeacherWorkload";
import LoadingState from "@/components/QueryState/LoadingState";
import ErrorState from "@/components/QueryState/ErrorState";
import EditRoleOfTeacher from "@/components/EditRoleOfTeacher/EditRoleOfTeacher";

export default function ManagementTeacherModal() {

    const { hub_id } = useParams();
    const { data: teachers = [], isLoading, isError, error } = useGetTeachersWorkload(hub_id as string);

    if(isLoading){
        return <LoadingState fullScreen message="Loading..."/>
    } 

    if(isError){
        return <ErrorState fullScreen message={error.message || "Something went wrong"}/>
    }

    return (

        <div className="bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Management - Manage Member</h1>

            <EditRoleOfTeacher
                hubId={hub_id as string}
                currentUserRole="Master"
                teachersList={teachers}
            />

            <AddTeacherToHubModal
                // isOpen={isAddModalOpen}
                // onClose={() => setAddModalOpen(false)}
                hubId={hub_id as string}
                teachersInHub={teachers}
            />
        </div>
    );
}