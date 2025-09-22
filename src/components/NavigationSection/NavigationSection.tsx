import { LucideIcon } from "lucide-react";

type NavigationSectionProps = {
    title: string;
    items: { name: string; icon: LucideIcon; href: string; }[];
    navigateTo: (page: string) => void;
    activePage: string;
    isShrunk: boolean;
}

export default function NavigationSection({ title, items, navigateTo, activePage, isShrunk }: NavigationSectionProps) {

    return (
        <div className="mb-6">
            {!isShrunk && (
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {title}
                </h2>
            )}
            <ul>
                {items.map((item) => (
                    <li key={item.name} className="mb-2">
                        <button
                            onClick={() => navigateTo(item.href)}
                            className={`cursor-pointer flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${activePage === item.href ? 'bg-slate-700 text-blue-400' : 'text-slate-200 hover:bg-slate-700 hover:text-white'}`}
                            title={item.name}
                        >
                            <item.icon className={`h-5 w-5 ${isShrunk ? 'mx-auto' : 'mr-3'}`} />
                            <span className={`text-base font-semibold transition-opacity duration-200 ${isShrunk ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>{item.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}