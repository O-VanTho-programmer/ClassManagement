'use client';

import React from 'react';
import Button from "../Button/Button";
import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    fullScreen?: boolean;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorState({ title = 'Something went wrong', message = 'Please try again.', fullScreen = false, onRetry, className = '' }: ErrorStateProps) {
    const content = (
        <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            {onRetry && (
                <Button
                    color="blue"
                    icon={RefreshCw}
                    title="Retry"
                    onClick={onRetry}
                />
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
                {content}
            </div>
        );
    }

    return (
        <div className={`w-full flex items-center justify-center py-8 ${className}`}>
            {content}
        </div>
    );
}


