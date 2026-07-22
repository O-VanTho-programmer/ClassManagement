import { ArrowRightIcon, LucideIcon } from "lucide-react";
 
export interface CardDirectionProps {
    icon: LucideIcon,
    title: string,
    descr: string,
    bg_clr: 'yellow' | 'green' | 'red' | 'blue',
    onClick: () => void;
}

export default function CardDirection({ icon, title, descr, bg_clr, onClick }: CardDirectionProps) {
    const Icon = icon;

    const borderClasses = {
        'yellow': 'border-t-amber-500',
        'green': 'border-t-emerald-500',
        'red': 'border-t-rose-500',
        'blue': 'border-t-indigo-500',
    };

    const iconBgClasses = {
        'yellow': 'bg-amber-50 text-amber-600',
        'green': 'bg-emerald-50 text-emerald-600',
        'red': 'bg-rose-50 text-rose-600',
        'blue': 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div className={`
            group rounded-xl p-5 shadow-sm border border-slate-200/70 bg-white/90 backdrop-blur-sm
            transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
            border-t-4 ${borderClasses[bg_clr]} flex flex-col justify-between h-[180px]
        `}>
            <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${iconBgClasses[bg_clr]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight group-hover:text-slate-900">
                        {title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-normal leading-normal">
                        {descr}
                    </p>
                </div>
            </div>
            <button
                onClick={onClick}
                className="w-full bg-slate-950 text-white cursor-pointer font-semibold py-2 px-4 rounded-lg text-xs transition-colors duration-200 hover:bg-slate-800 shadow-sm flex items-center justify-center gap-1.5"
            >
                <span>View Details</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
