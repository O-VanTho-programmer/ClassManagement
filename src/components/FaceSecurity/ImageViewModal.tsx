import React from 'react'
import IconButton from '../IconButton/IconButton'
import { X } from 'lucide-react'

type ImageViewModalProps = {
    student_name: string
    url: string
    isOpen: boolean
    onClose: () => void
}

export default function ImageViewModal({ student_name, url, isOpen, onClose }: ImageViewModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">

                <div className="flex justify-between p-5 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">View Image</h3>

                        <p className="text-sm text-gray-500 leading-relaxed">
                            {student_name}
                        </p>
                    </div>

                    <IconButton
                        icon={X}
                        onClick={onClose}
                        size={20}
                    />
                </div>

                <img className='w-full h-full object-cover' src={url} alt={student_name} />
            </div>
        </ div>
    )
}