import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import NavigationSection from "../NavigationSection/NavigationSection";
import { useParams } from "next/navigation";

type SideNavigationProps = {
    isOpen: boolean;
    toggleNav: () => void;
    activePage: string;
    isShrunk: boolean;
    toggleShrink: () => void;
    navigationSections: {
        title: string;
        items: { name: string; icon: any; href: string }[];
    }[];
}

export default function SideNavigation({isOpen, toggleNav, activePage, isShrunk, toggleShrink, navigationSections }: SideNavigationProps) {

    const { hub_id } = useParams();
    return (
        <nav
            className={`fixed inset-y-0 left-0 z-40 bg-slate-800 text-slate-300 shadow-xl transform transition-all duration-300 md:relative flex flex-col h-screen ${isShrunk ? 'w-20' : 'w-64'} ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 bg-slate-900 md:hidden flex-shrink-0 shadow-sm z-10">
                <h1 className="font-bold text-blue-400 text-xl">TutorDesk</h1>
                <button onClick={toggleNav} className="text-white p-2 rounded-full hover:bg-slate-700 transition-colors">
                    <XIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Desktop Header */}
            <div className="p-6 text-center flex-shrink-0 hidden md:block border-b border-slate-700/50">
                <h1 className={`font-bold text-blue-400 transition-all duration-300 ${isShrunk ? 'text-2xl' : 'text-3xl tracking-wide'}`}>
                    {isShrunk ? 'TD' : 'TutorDesk'}
                </h1>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto py-6 px-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <ul className="space-y-1">
                    {navigationSections.map((section, index) => (
                        <NavigationSection
                            key={index}
                            title={section.title}
                            items={section.items}
                            hubId={hub_id as string}
                            activePage={activePage}
                            isShrunk={isShrunk}
                        />
                    ))}
                </ul>
            </div>

            {/* Footer / Shrink Toggle */}
            <div className={`p-4 border-t border-slate-700/50 flex-shrink-0 hidden md:flex items-center transition-all duration-300 ${isShrunk ? 'justify-center' : 'justify-end'}`}>
                <button 
                    onClick={toggleShrink} 
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 hover:scale-105 active:scale-95"
                    aria-label={isShrunk ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isShrunk ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
                </button>
            </div>
        </nav>
    );
}