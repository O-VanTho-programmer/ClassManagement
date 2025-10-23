'use client';

import React from 'react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

export default function LoadingState({ message = 'Loading...', fullScreen = false, className = '' }: LoadingStateProps) {
    if (fullScreen) {
        return (
            <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full flex items-center justify-center py-8 ${className}`}>
            <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>{message}</span>
            </div>
        </div>
    );
}


