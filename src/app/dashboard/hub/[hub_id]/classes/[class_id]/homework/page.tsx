'use client'

import EditAssignmentHomeworkModal from '@/components/EditAssignmentHomeworkModal/EditAssignmentHomeworkModal';
import HomeworkCard from '@/components/HomeworkCard/HomeworkCard';
import ViewHomeworkModal from '@/components/ViewHomeworkModal/ViewHomeworkModal';
import { useGetHomeworkByClassId } from '@/hooks/useGetHomeworkByClassId';
import { BookOpen, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

export default function ClassHomeworkPage() {
    const {class_id} = useParams();

    const [isViewOpen, setViewOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<ClassHomework | null>(null);

    const { data: assignments = [], isLoading, isError } = useGetHomeworkByClassId(class_id as string);

    const handleViewDetails = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setViewOpen(true);
    };

    const handleEdit = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setEditOpen(true);
    };

    const handleViewSubmissions = (assignment: ClassHomework) => {
        alert(`Opening submissions for: ${assignment.title}`);
        // You would navigate to a new page here, e.g.:
        // router.push(`/class/${classId}/homework/${assignment.classHomeworkId}/submissions`);
    };

    const handleCloseModals = () => {
        setViewOpen(false);
        setEditOpen(false);
        setSelectedAssignment(null); // Clear selection on close
    };
    
    // --- Render Logic ---

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
                    <h3 className="text-lg font-semibold">No Homework Assigned</h3>
                    <p>This class does not have any homework assignments yet.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment : ClassHomework) => (
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
            {/* This component would live inside your ClassDetailsPage.
                The header below is just for this example.
            */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Class Homework</h1>
            
            <div className="">
                {renderContent()}
            </div>

            <ViewHomeworkModal 
                isOpen={isViewOpen}
                onClose={handleCloseModals}
                assignment={selectedAssignment}
            />
            
            <EditAssignmentHomeworkModal 
                isOpen={isEditOpen}
                onClose={handleCloseModals}
                assignment={selectedAssignment}
            />
        </div>
    );
}