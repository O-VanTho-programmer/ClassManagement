'use client'

import EditAssignmentHomeworkModal from '@/components/EditAssignmentHomeworkModal/EditAssignmentHomeworkModal';
import PermissionGuardClient from '@/components/PermissionGuard/PermissionGuardClient';
import ViewClassHomeworkList from '@/components/ViewClassHomeworkList/ViewClassHomeworkList';
import ViewHomeworkModal from '@/components/ViewHomeworkModal/ViewHomeworkModal';
import { useGetClassHomeworkByClassId } from '@/hooks/useGetClassHomeworkByClassId';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function ClassHomeworkPage() {

    const router = useRouter();
    const { class_id } = useParams();
    const { hub_id } = useParams();

    const [isViewOpen, setViewOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<ClassHomework | null>(null);

    const { data: assignments = [], isLoading, isError } = useGetClassHomeworkByClassId(class_id as string);

    const handleViewDetails = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setViewOpen(true);
    };

    const handleEdit = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setEditOpen(true);
    };

    const handleViewSubmissions = (assignment: ClassHomework) => {
        const homeworkId = assignment.homework_id;
        const assignmentId = assignment.class_homework_id;
        router.push(`homework/${homeworkId}/${assignmentId}/submission`)
    };

    const handleCloseModals = () => {
        setViewOpen(false);
        setEditOpen(false);
        setSelectedAssignment(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Class Homework</h1>

            <div className="">
                <PermissionGuardClient
                    hubId={hub_id as string}
                    requiredPermission={"VIEW_HOMEWORK"}
                >
                    <ViewClassHomeworkList
                        assignments={assignments as ClassHomeworkWithClassName[]}
                        isLoading={isLoading}
                        isError={isError}
                        handleViewDetails={handleViewDetails}
                        handleEdit={handleEdit}
                        handleViewSubmissions={handleViewSubmissions}
                    />
                </PermissionGuardClient>
            </div>

            {selectedAssignment && isViewOpen && (
                <ViewHomeworkModal
                    isOpen={isViewOpen}
                    onClose={handleCloseModals}
                    assignment={selectedAssignment}
                />
            )}

            {selectedAssignment && isEditOpen && (
                <EditAssignmentHomeworkModal
                    initialAssignedDate={selectedAssignment.assigned_date}
                    initialDueDate={selectedAssignment.due_date}
                    isOpen={isEditOpen}
                    onClose={handleCloseModals}
                    assignment={selectedAssignment}
                    class_id={class_id as string}
                />
            )}
        </div>
    );
}