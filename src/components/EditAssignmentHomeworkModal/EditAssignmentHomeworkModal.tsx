import { updateClassHomeworkDate } from '@/lib/api/updateClassHomework';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Button from '../Button/Button';
import DeleteConfirmHomeworkAssignment from '../DeleteConfirmHomeworkAssignment/DeleteConfirmHomeworkAssignment';
import DatePicker from '../DatePicker/DatePicker';
import formatDateForCompare from '@/utils/Format/formatDateForCompare';
import { useAlert } from '../AlertProvider/AlertContext';

type EditAssignmentHomeworkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    assignment: ClassHomework | null;
    initialAssignedDate: string;
    initialDueDate: string;
    class_id: string;
}

export default function EditAssignmentHomeworkModal({
    isOpen,
    onClose,
    assignment,
    initialAssignedDate,
    initialDueDate,
    class_id,
}: EditAssignmentHomeworkModalProps) {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();

    const [assignedDate, setAssignedDate] = useState(initialAssignedDate);
    const [dueDate, setDueDate] = useState(initialDueDate);
    const [selectedAssignment, setSelectedAssignment] = useState<ClassHomework | null>(null);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const mutationUpdateHomeworkAssignmentDate = useMutation({
        mutationFn: () => updateClassHomeworkDate(assignment!.class_homework_id, formatDateForCompare(assignedDate), formatDateForCompare(dueDate)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homework_by_class_id', class_id] });
            showAlert('Assignment dates updated!', 'success');
            onClose();
        },
        onError: (error) => {
            showAlert(`Error updating dates: ${error.message}`, 'error');
        }
    });

    const handleSubmit = () => {
        if (new Date(dueDate) < new Date(assignedDate)) {
            showAlert('Due date cannot be before the assigned date.', 'error');
            return;
        }
        mutationUpdateHomeworkAssignmentDate.mutate();
    };

    const handleDelete = () => {
        setSelectedAssignment(assignment);
        setDeleteOpen(true);
    };

    if (!isOpen || !assignment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Assignment</h2>
                    <p className="text-sm text-gray-600">"{assignment.title}"</p>
                </div>

                <div className="flex-grow overflow-y-auto my-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePicker
                            label='Assigned Date'
                            onChange={(date) => setAssignedDate(date)}
                            date={formatDateForCompare(assignedDate)}
                            icon={Clock}
                            isLabelAbsolute={false}
                        />

                        <DatePicker
                            label='Due Date'
                            onChange={(date) => setDueDate(date)}
                            date={formatDateForCompare(dueDate)}
                            icon={Clock}
                            isLabelAbsolute={false}
                        />

                    </div>
                </div>

                <div className="pt-6 flex justify-between gap-3 border-t border-gray-300">
                    <Button onClick={handleDelete} title='Delete' color='red_off' />
                    <div className='flex items-center gap-1'>
                        <Button onClick={onClose} title='Cancel' color='white' />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={mutationUpdateHomeworkAssignmentDate.isPending}
                            className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                        >
                            {mutationUpdateHomeworkAssignmentDate.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {isDeleteOpen && selectedAssignment && (
                <DeleteConfirmHomeworkAssignment
                    class_id={class_id as string}
                    isOpen={isDeleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    assignment={selectedAssignment}
                    onDeleteSuccess={() => {
                        onClose();
                        setSelectedAssignment(null);
                    }}
                />
            )}
        </div>
    );
}