// import { useQueryClient } from '@tanstack/react-query';
// import React, { useState } from 'react'

// type EditTeacherModalProps = {
//     isOpen: boolean;
//     onClose: () => void;
//     teacher: TeacherInHub;
//     hubId: string;
// }

// export default function EditTeacherModal({
//     isOpen,
//     onClose,
//     teacher,
//     hubId,
// }: EditTeacherModalProps) {

//     const queryClient = useQueryClient();

//     // const { data: allClasses = [], isLoading: isLoadingClasses } = useQuery({
//     //     queryKey: ['allClasses', hubId],
//     //     queryFn: () => fetchAllClasses(hubId),
//     //     enabled: isOpen,
//     // });

//     const [role, setRole] = useState<'Master' | 'Member'>('Member');
//     // const [assignedClassIds, setAssignedClassIds] = useState<Set<string>>(new Set());
//     // const [classSearch, setClassSearch] = useState('');

//     // const handleClassToggle = (classId: string) => {
//     //     setAssignedClassIds(prev => {
//     //         const newSet = new Set(prev);
//     //         if (newSet.has(classId)) {
//     //             newSet.delete(classId);
//     //         } else {
//     //             newSet.add(classId);
//     //         }
//     //         return newSet;
//     //     });
//     // };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!isEditable) return;

//     };

//     // const filteredClasses = useMemo(() => {
//     //     return allClasses.filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase()));
//     // }, [allClasses, classSearch]);

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
//                 <div className="flex items-center justify-between p-6 border-b">
//                     <h2 className="text-2xl font-bold text-gray-800">Edit Teacher</h2>
//                     <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
//                         <X size={20} />
//                     </button>
//                 </div>


//                 <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
//                     <div className="p-6 space-y-4 bg-gray-50">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-500">Full Name</label>
//                             <p className="text-lg font-semibold text-gray-900">{teacher?.name}</p>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-500">Email Address</label>
//                             <p className="text-md text-gray-700">{teacher?.email}</p>
//                         </div>
//                     </div>

//                     <div className="border-t p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-1">Role</h3>
//                         <p className="text-sm text-gray-500 mb-4">"Master" can edit settings. "Member" can only manage assigned classes.</p>
//                         <select
//                             value={role}
//                             onChange={(e) => setRole(e.target.value as any)}
//                             disabled={!isEditable}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                         >
//                             <option value="Member">Member</option>
//                             <option value="Master">Master</option>
//                         </select>
//                     </div>

//                     <div className="border-t p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Assignments</h3>
//                         <div className="relative">
//                             <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
//                             <input
//                                 type="text"
//                                 value={classSearch}
//                                 onChange={(e) => setClassSearch(e.target.value)}
//                                 placeholder="Search classes..."
//                                 disabled={!isEditable}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//                             />
//                         </div>

//                         {isLoadingClasses ? (
//                             <div className="py-6 flex justify-center">
//                                 <Loader2 size={24} className="animate-spin text-blue-600" />
//                             </div>
//                         ) : (
//                             <div className={`mt-4 max-h-60 overflow-y-auto space-y-2 border rounded-md p-3 ${!isEditable ? 'bg-gray-100' : ''}`}>
//                                 {filteredClasses.length > 0 ? filteredClasses.map(cls => (
//                                     <label key={cls.id} className={`flex items-center p-2 rounded-md hover:bg-gray-50 ${isEditable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
//                                         <input
//                                             type="checkbox"
//                                             checked={assignedClassIds.has(cls.id)}
//                                             onChange={() => handleClassToggle(cls.id)}
//                                             disabled={!isEditable}
//                                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-200"
//                                         />
//                                         <span className={`ml-3 text-sm ${isEditable ? 'text-gray-800' : 'text-gray-500'}`}>{cls.name}</span>
//                                     </label>
//                                 )) : (
//                                     <p className="text-sm text-gray-500 text-center py-4">No classes found.</p>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <div className="p-6 flex justify-between items-center border-t bg-gray-50 rounded-b-xl">
//                         {!isEditable && (
//                             <p className="text-sm text-yellow-800">Only a "Master" can edit these settings.</p>
//                         )}
//                         <div className="flex justify-end gap-3 w-full">
//                             <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
//                                 Cancel
//                             </button>
//                             <button type="submit" disabled={mutation.isPending || !isEditable} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center">
//                                 {mutation.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }