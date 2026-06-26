import { Loader2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import IconButton from '../IconButton/IconButton'
import Button from '../Button/Button'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    const sampleAnswerKey = `<p>1) A, 2) B, 3) C, 4) D, 5) E,</p><p>7) This is the correct answer,</p><p><br></p><p>Note:</p><ul><li>Multiple choice questions give 5 points each,</li><li>Essay questions give 10 points each.</li><li>Give half of maximun point if essay questions correct halfly.</li></ul>`

    const [key, setKey] = useState(initialKey || sampleAnswerKey);

    useEffect(() => {
        setKey(initialKey || sampleAnswerKey);
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
                <div className="flex-grow overflow-y-auto mt-6 pb-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provide the correct answers and grading criteria for the AI.
                    </label>
                    <div className="space-y-1">
                        <ReactQuill
                            theme="snow"
                            value={key}
                            onChange={setKey}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200"
                            placeholder="The draft answer key will appear here..."
                        />
                    </div>
                </div>
                <div className="pt-6 flex justify-end gap-3 border-t">
                    {/* --- FIX: Corrected "type.button" to "type='button'" --- */}
                    <Button
                        onClick={onClose}
                        color='white'
                        title='Cancel'
                    />
                    <Button
                        color='blue'
                        onClick={handleSave}
                        disabled={isSaving}
                        title={isSaving ? 'Saving...' : 'Save Key'}
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}