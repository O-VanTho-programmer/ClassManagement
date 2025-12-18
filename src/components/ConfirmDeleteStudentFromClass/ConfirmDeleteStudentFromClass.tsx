import { AlertTriangle, Loader2, X } from 'lucide-react'
import React from 'react'
import Button from '../Button/Button'
import IconButton from '../IconButton/IconButton'

type ConfirmDeleteStudentFromClassProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
    student: StudentWithEnrollment
}

export default function ConfirmDeleteStudentFromClass({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    student,
}: ConfirmDeleteStudentFromClassProps) {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 overlay flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Remove Student</h3>
                    <IconButton
                        icon={X}
                        onClick={onClose}
                        size={20}
                    />
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-1">
                                Are you sure?
                            </h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                You are about to remove <strong className="text-gray-900">{student.name}</strong> from this class.
                                <br />
                                This action will also delete their attendance records for this class.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        disabled={isDeleting}
                        title='Cancel'
                        color='white'
                    />
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="cursor-pointer px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 shadow-sm shadow-red-200 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Removing...
                            </>
                        ) : (
                            'Remove Student'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}