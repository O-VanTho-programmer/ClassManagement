'use client';

import { useEffect, useState } from "react";
import SideNavigation from "../SideNavigation/SideNavigation"
import { MenuIcon, BellElectricIcon, CalendarClock, CalendarDays, GraduationCapIcon, HomeIcon, StarIcon, BookPlusIcon, BookUp2, HatGlasses } from "lucide-react";
import HeaderDashboard from "../HeaderDashboard/HeaderDashboard";
import { usePathname } from "next/navigation";

export default function LayoutDashboardHub({ children }: { children: React.ReactNode }) {

    const navigationSections = [
        {
            title: 'Class Management',
            items: [
                { name: 'Classes', icon: GraduationCapIcon, href: '/classes' },
                { name: 'Attendance', icon: CalendarDays, href: '/attendance' },
            ]
        },
        {
            title: 'Homework',
            items: [
                { name: 'Homework List', icon: BookPlusIcon, href: '/homework_list' }
            ]
        },
        {
            title: 'Schedule',
            items: [
                { name: 'Class Schedule', icon: CalendarClock, href: '/class_schedule' },
                { name: 'Class Period', icon: BellElectricIcon, href: '/time_table' },
            ]
        },
        {
            title: 'Teacher',
            items: [
                { name: 'Teacher List', icon: HatGlasses, href: '/teacher' },
            ]
        },
    ];

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNavShrunk, setIsNavShrunk] = useState(false);
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState('');

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