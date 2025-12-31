'use client'

import { useUser } from '@/context/UserContext';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type PermissionGuardClientProps = {
    children: React.ReactNode;
    hubId: string;
    requiredPermission: string | string[];
    fallback?: React.ReactNode;
}

export default function PermissionGuardClient({
    children,
    hubId,
    requiredPermission,
    fallback
}: PermissionGuardClientProps) {
    const user = useUser();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const { hasPermission: hasAccess, isLoading } = useHasPermission(
        hubId,
        requiredPermission as any
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isLoading && !user) {
            router.push("/auth");
        }
    }, [user, isLoading, router, isMounted]);

    if (!isMounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Required permission: {Array.isArray(requiredPermission) ? requiredPermission.join(", ") : requiredPermission}
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}