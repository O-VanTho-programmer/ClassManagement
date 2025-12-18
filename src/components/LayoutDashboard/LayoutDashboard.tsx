'use client';

import React, { useEffect, useState } from 'react'
import HeaderDashboard from '../HeaderDashboard/HeaderDashboard';
import SideNavigation from '../SideNavigation/SideNavigation';
import {  MenuIcon, School } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNavShrunk, setIsNavShrunk] = useState(false);
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState('');

    const navigationSections = [
        {
            title: 'Hub Management',
            items: [
                { name: 'Hub', icon: School, href: '/dashboard/hub' },
            ]
        },
    ];

    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const toggleShrink = () => {
        setIsNavShrunk(!isNavShrunk);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            <div className="flex h-screen">
                {/* Mobile menu button */}
                <div className="fixed top-4 left-4 z-50 md:hidden">
                    <button onClick={toggleNav} className="cursor-pointer p-2 rounded-full bg-slate-800 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>

                <SideNavigation
                    isOpen={isNavOpen}
                    toggleNav={toggleNav}
                    activePage={currentPage}
                    isShrunk={isNavShrunk}
                    navigationSections={navigationSections}
                    toggleShrink={toggleShrink} />
                <main className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 md:pt-0 bg-gray-50`}>
                    <HeaderDashboard />
                    <div className="container py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}