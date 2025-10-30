import { Loader2, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchUsersByEmail } from "@/hooks/useSearchUsersByEmail";
import { addTeacherToHub } from "@/lib/api/addTeacherToHub";

interface AddTeacherToHubModalProps {
    // isOpen: boolean;
    // onClose: () => void;
    hubId: string;
    teachersInHub: TeacherWorkload[];
}

export default function AddTeacherToHubModal({
    // isOpen,
    // onClose,
    hubId,
    teachersInHub
}: AddTeacherToHubModalProps) {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: searchResults = [], isLoading: isSearching } = useSearchUsersByEmail(searchTerm);

    const teachersInHubIds = useMemo(() => new Set(teachersInHub.map(t => t.id)), [teachersInHub]);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

    const handleSubmit = async () => {
        if (selectedTeacherIds.length === 0) {
            return;
        }

        for (const teacherId of selectedTeacherIds) {
            console.log(teacherId);
            const res = await addTeacherToHub(teacherId, hubId);

            if (res.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['teachers_workload', hubId] });
            }
        }
    }

    const handleToggleSelection = (teacherId: string) => {
        setSelectedTeacherIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(teacherId)) {
                newSet.delete(teacherId);
            } else {
                newSet.add(teacherId);
            }
            return Array.from(newSet);
        });
    }

    const handleSelectAll = () => {
        if (!searchResults) {
            return;
        }

        if (selectedTeacherIds.length === searchResults.length) {
            setSelectedTeacherIds([]);
        } else {
            setSelectedTeacherIds(searchResults.map(u => u.id)); // Select all
        }
    };

    // const handleClose = () => {
    //     setSearchTerm('');
    //     setSelectedTeacherIds([]);
    //     onClose();
    // };

    // if (!isOpen) return null;

    return (
        // <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
        <div className="bg-white rounded-xl w-full max-w-xl p-6 transform transition-all duration-300 scale-100 flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add Teacher to Hub</h2>
                {/* <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X size={20} />
                    </button> */}
            </div>

            {/* Search Input */}
            <div className="relative mt-6">
                <span className="absolute right-2 bottom-2 text-gray-400">@example.com</span>
                <SearchBar
                    search_width_style="medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Results List */}
            <div className="flex-grow overflow-y-auto mt-4 border rounded-lg">
                {isSearching && (
                    <div className="p-6 flex justify-center items-center">
                        <Loader2 size={24} className="animate-spin text-blue-600" />
                    </div>
                )}

                {!isSearching && searchTerm.length < 3 && (
                    <p className="p-6 text-center text-gray-500">Please type 3 or more characters to search.</p>
                )}

                {!isSearching && searchTerm.length >= 3 && searchResults && searchResults.length === 0 && (
                    <p className="p-6 text-center text-gray-500">No users found matching your search.</p>
                )}

                {!isSearching && searchResults && searchResults.length > 0 && (
                    <>
                        {/* Select All Checkbox */}
                        <div className="p-3 border-b bg-gray-50">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTeacherIds.length === searchResults.length}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Select all ({selectedTeacherIds.length} / {searchResults.length})
                                </span>
                            </label>
                        </div>

                        {/* Teacher List */}
                        <ul className="divide-y divide-gray-200">
                            {searchResults.map(user => {
                                const isSelected = selectedTeacherIds.includes(user.id);
                                const isAlreadyInHub = teachersInHubIds.has(user.id);

                                return (
                                    (
                                        <li
                                            key={user.id}
                                            className={`p-3 cursor-pointer flex relative items-center ${isAlreadyInHub ? 'bg-gray-100' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                            onClick={() => { if (!isAlreadyInHub) handleToggleSelection(user.id) }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected || isAlreadyInHub}
                                                readOnly
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            {isAlreadyInHub && (
                                                <span className="absolute right-5 text-sm font-medium text-gray-500">Already In Hub</span>
                                            )}
                                        </li>
                                    )
                                )
                            })}
                        </ul>
                    </>
                )}
            </div>
            <div className="pt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">{selectedTeacherIds.length}</span> selected
                </p>
                <div className="flex gap-3">
                    {/* <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Done
                        </button> */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={selectedTeacherIds.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                        Add Selected ({selectedTeacherIds.length})
                    </button>
                </div>
            </div>
        </div>
        // </div>
    );
}