import { Loader2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import IconButton from '../IconButton/IconButton'
import Button from '../Button/Button'

type SetAnswerKeyModalProps = {
    isOpen: boolean
    onClose: () => void
    initialKey: string
    onSave: (newKey: string) => void
    isSaving: boolean
}

export default function SetAnswerKeyModal({
    isOpen,
    onClose,
    initialKey,
    onSave,
    isSaving
}: SetAnswerKeyModalProps) {
    const [key, setKey] = useState(initialKey);

    useEffect(() => {
        setKey(initialKey);
    }, [initialKey, isOpen]);

    const handleSave = () => {
        onSave(key);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Set Answer Key</h2>
                    <IconButton icon={X} onClick={onClose} size={20} className='p-2 rounded-full text-gray-400 hover:bg-gray-100' />
                </div>
                <div className="flex-grow overflow-y-auto mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provide the correct answers and grading criteria for the AI.
                    </label>
                    <textarea
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="e.g.,&#10;1. x = 5 (10 points)&#10;2. y = 10 (10 points)&#10;..."
                        className="w-full h-80 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                    />
                </div>
                <div className="pt-6 flex justify-end gap-3 border-t">
                    {/* --- FIX: Corrected "type.button" to "type='button'" --- */}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        color='white'
                        title='Cancel'
                    />
                    <Button
                        color='blue'
                        onClick={handleSave}
                        disabled={isSaving}
                        title='Save Key'
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}