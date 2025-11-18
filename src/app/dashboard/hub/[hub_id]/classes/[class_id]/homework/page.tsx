'use client'

import EditAssignmentHomeworkModal from '@/components/EditAssignmentHomeworkModal/EditAssignmentHomeworkModal';
import HomeworkCard from '@/components/HomeworkCard/HomeworkCard';
import ViewHomeworkModal from '@/components/ViewHomeworkModal/ViewHomeworkModal';
import { useGetClassHomeworkByClassId } from '@/hooks/useGetClassHomeworkByClassId';
import { BookOpen, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function ClassHomeworkPage() {

    const router = useRouter();
    const { class_id } = useParams();

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


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="p-10 flex justify-center items-center">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading homework...</span>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg">
                    Error loading homework. Please try again.
                </div>
            );
        }

        if (assignments.length === 0) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold">Nso Homework Assigned</h3>
                    <p>This class does not have any homework assignments yet.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {assignments.map((assignment: ClassHomework) => (
                    <HomeworkCard
                        key={assignment.homework_id}
                        assignment={assignment}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onViewSubmissions={handleViewSubmissions}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Class Homework</h1>

            <div className="">
                {renderContent()}
            </div>

            {selectedAssignment && isViewOpen &&(
                <ViewHomeworkModal
                    isOpen={isViewOpen}
                    onClose={handleCloseModals}
                    assignment={selectedAssignment}
                />
            )}

            {selectedAssignment && isEditOpen && (
                <EditAssignmentHomeworkModal
                    initialAssignedDate={selectedAssignment.assigned_date}
                    initialdueDate={selectedAssignment.due_date}
                    isOpen={isEditOpen}
                    onClose={handleCloseModals}
                    assignment={selectedAssignment}
                />
            )}
        </div>
    );
}