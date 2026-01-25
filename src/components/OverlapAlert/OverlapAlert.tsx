import React from 'react'
import Button from '../Button/Button';

type OverlapAlertProps = {
    overlapClasses: FormattedOverlap | null;
    setOpenOverlapAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OverlapAlert({ overlapClasses, setOpenOverlapAlert }: OverlapAlertProps) {

    const flattenedConflicts = overlapClasses ? Object.values(overlapClasses).flat() : [];

    if (!flattenedConflicts.length) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>

                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Schedule Conflict</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        You cannot enroll in this course because it overlaps with your existing schedule.
                    </p>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">

                    {flattenedConflicts.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="flex flex-col bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md"
                        >
                            <h3>Student: {item.student_name}</h3>

                            {item.overlaped_classes?.map((c: any) => (
                                <>
                                    <span className="font-semibold text-gray-800 text-sm">
                                        {c.class_name}
                                    </span>
                                    <div className="flex items-center text-xs text-red-700 mt-1 font-medium">
                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{c.day_of_week}</span>
                                        <span className="mx-1">•</span>
                                        <span>
                                            {/* Safety check for string slicing */}
                                            {c.start_time?.toString().slice(0, 5)} - {c.end_time?.toString().slice(0, 5)}
                                        </span>
                                    </div>
                                </>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => setOpenOverlapAlert(false)}
                        className="cursor-pointer w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-gray-900 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    )
}