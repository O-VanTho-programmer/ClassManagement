import React, { useState } from 'react'
import ImageViewModal from './ImageViewModal';
import Button from '../Button/Button';
import FaceRegistry from './FaceRegistry';
import { useQueryClient } from '@tanstack/react-query';

type FaceStudentsTableListProps = {
    students: StudentWithFaceDescriptor[];
    assignmentId: string;
}

export default function FaceStudentsTableList({ students, assignmentId }: FaceStudentsTableListProps) {
    const [viewStudentImage, setViewStudentImage] = useState<boolean>(false);
    const [openFaceRegistry, setOpenFaceRegistry] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithFaceDescriptor | null>(null);
    const queryClient = useQueryClient();

    const handleEditFaceRegistry = (student: StudentWithFaceDescriptor) => {
        setSelectedStudent(student);
        setOpenFaceRegistry(true);
    };

    const handleCloseFaceRegistry = () => {
        setOpenFaceRegistry(false);
        setSelectedStudent(null);
    };

    const handleFaceRegistrySuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['students_with_face_descriptor', assignmentId] });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student's Face</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {s.face_descriptor && s.face_img_url ? (
                                    <img
                                        onClick={() => {
                                            setSelectedStudent(s);
                                            setViewStudentImage(true);
                                        }}
                                        src={s.face_img_url}
                                        alt="Student's face"
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Not Registered
                                    </span>
                                )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                    color='blue'
                                    title={s.face_img_url ? 'Edit' : 'Register'}
                                    onClick={() => handleEditFaceRegistry(s)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {viewStudentImage && selectedStudent && (
                <ImageViewModal
                    isOpen={viewStudentImage}
                    onClose={() => { setViewStudentImage(false); setSelectedStudent(null) }}
                    student_name={selectedStudent?.name || ''}
                    url={selectedStudent?.face_img_url || ''}
                />
            )}

            {openFaceRegistry && (
                <FaceRegistry
                    isOpen={openFaceRegistry}
                    onClose={handleCloseFaceRegistry}
                    student={selectedStudent as StudentWithFaceDescriptor}
                    onSuccess={handleFaceRegistrySuccess}
                />
            )}
        </div>
    );
}