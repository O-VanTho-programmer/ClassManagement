'use client';

import ErrorState from '@/components/QueryState/ErrorState';
import LoadingState from '@/components/QueryState/LoadingState';
import ViewClassHomeworkList from '@/components/ViewClassHomeworkList/ViewClassHomeworkList';
import { useGetClassHomeworkByHomeworkId } from '@/hooks/useGetClassHomeworkByHomeworkId';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

function HomeworkSubmissionsPage() {

    const router = useRouter();

    const { homework_id, hub_id } = useParams();
    const { data: homeworkClass = [], isLoading, isError, error } = useGetClassHomeworkByHomeworkId(homework_id as string);

    const [selectedAssignment, setSelectedAssignment] = useState<ClassHomework | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    if (isLoading) {
        return <LoadingState />
    }

    if (isError) {
        return <ErrorState message={error ? error.message : 'Something went wrong'} />
    }

    const handleViewDetails = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setViewOpen(true);
    };

    const handleEdit = (assignment: ClassHomework) => {
        setSelectedAssignment(assignment);
        setEditOpen(true);
    };

    const handleViewSubmissions = (assignment: ClassHomework) => {
        const classId = assignment.class_id;
        const homeworkId = assignment.homework_id;
        const assignmentId = assignment.class_homework_id;

        router.push(`../../classes/${classId}/homework/${homeworkId}/${assignmentId}/submission`)
    };

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'>Homework Submissions</h1>
            <ViewClassHomeworkList
                assignments={homeworkClass as ClassHomeworkWithClassName[]}
                isLoading={isLoading}
                isError={isError}
                handleViewDetails={handleViewDetails}
                handleEdit={handleEdit}
                handleViewSubmissions={handleViewSubmissions}
            />

        </div>
    )
}

export default HomeworkSubmissionsPage