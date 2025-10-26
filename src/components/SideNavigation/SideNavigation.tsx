import { BellElectricIcon, CalendarClock, CalendarDays, ChevronLeftIcon, ChevronRightIcon, GraduationCapIcon, HomeIcon, SettingsIcon, StarIcon, XIcon } from "lucide-react";
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
            className={`fixed inset-y-0 left-0 z-40 bg-slate-800 text-white shadow-lg transform transition-all duration-300 ${isShrunk ? 'w-20' : 'w-64'} md:relative ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
            {/* Mobile close button and title */}
            <div className="flex items-center justify-end p-4 bg-slate-900 md:hidden">
                <button onClick={toggleNav} className="text-white p-2 rounded-full hover:bg-slate-700">
                    <XIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
                <div className="text-center mb-6">
                    <h1 className={`font-bold text-blue-400 transition-opacity duration-300 ${isShrunk ? 'text-xl' : 'text-3xl'}`}>
                        {isShrunk ? 'CH' : 'Class Hub'}
                    </h1>
                </div>
                <ul className="flex-grow">
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
                {/* Toggle button for shrinking/expanding */}
                <div className="flex justify-end mt-4 md:block hidden">
                    <button onClick={toggleShrink} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400">
                        {isShrunk ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}