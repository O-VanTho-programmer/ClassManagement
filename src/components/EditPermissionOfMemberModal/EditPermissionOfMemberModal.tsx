import { useGetPermissions } from '@/hooks/useGetPermissions';
import React, { useEffect, useMemo, useState } from 'react'
import IconButton from '../IconButton/IconButton';
import { Loader2, Save, Shield, X } from 'lucide-react';
import { getCategoryPermissions } from '@/lib/getCategoryPermissions';
import Button from '../Button/Button';

type EditPermissionOfMemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    hubId: string;
    teacher: TeacherInHub;
    onSave: (selectedPermissions: string[], teacherId: string) => void;
}

export default function EditPermissionOfMemberModal({
    isOpen,
    onClose,
    hubId,
    teacher,
    onSave
}: EditPermissionOfMemberModalProps) {

    if (!isOpen) return null;

    const { data: allPermissions = [], isLoading: isLoadingPermission } = useGetPermissions();
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(teacher.permissions || []));
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (teacher.is_owner || teacher.role_hub.match('Owner') || teacher.role_hub.match('Master')) {
            setSelectedPermissions(new Set(allPermissions.map((p: Permission) => p.Code)));
        } else {
            setSelectedPermissions(new Set(teacher.permissions || []));
        }
    }, [teacher]);

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        allPermissions.forEach((perm) => {
            const category = getCategoryPermissions(perm.Code);
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(perm);
        });
        return groups;
    }, [allPermissions])

    const handleToggle = (code: string) => {
        setSelectedPermissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(code)) {
                newSet.delete(code);
            } else {
                newSet.add(code);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const allCode = allPermissions.map((p: Permission) => p.Code);

        if (allCode.length === selectedPermissions.size) {
            setSelectedPermissions(new Set());
        } else {
            setSelectedPermissions(new Set(allCode));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            await onSave(Array.from(selectedPermissions), teacher.id);
        } catch (error) {
            console.log(error, "error");
            alert("Failed to save permissions.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform max-h-96 transition-all duration-300 scale-100 flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <Shield size={18} className="mr-2 text-indigo-600" />
                            Permissions
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Editing access for <span className="font-semibold text-gray-700">{teacher.name}</span>
                        </p>
                    </div>
                    <IconButton onClick={onClose} icon={X} size={20} className="text-gray-400 hover:bg-gray-100 rounded-full" />
                </div>

                {/* Content - Scrollable List */}
                <div className="flex-grow overflow-y-auto p-0 bg-gray-50/50">
                    {isLoadingPermission ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p className="text-sm">Loading permissions...</p>
                        </div>
                    ) : (
                        <div className="p-5 space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSelectAll}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    {selectedPermissions.size === allPermissions.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            {/* Permission Groups */}
                            {Object.entries(groupedPermissions).map(([category, perms]) => (
                                <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="bg-gray-50/80 px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{category}</h3>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {perms.map((perm) => {
                                            const isSelected = selectedPermissions.has(perm.Code);
                                            return (
                                                <label
                                                    key={perm.PermissionId}
                                                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? 'bg-indigo-50/30' : ''}`}
                                                >
                                                    <div className="pr-4">
                                                        <p className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                                                            {perm.Code.replace(/_/g, ' ')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{perm.Description}</p>
                                                    </div>

                                                    {/* Custom Toggle / Checkbox UI */}
                                                    <div className="relative flex-shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={isSelected}
                                                            onChange={() => handleToggle(perm.Code)}
                                                        />
                                                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
                    <Button color='white' onClick={onClose} title='Cancle' />

                    <Button
                        icon={isSaving ? Loader2 : Save}
                        style={isSaving ? "animate-spin disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed" : ""}
                        title={isSaving ? "Saving..." : "Save Changes"}
                        onClick={handleSave}
                        disabled={isSaving}
                        color='blue'
                    />
                </div>
            </div>
        </div>
    )
}