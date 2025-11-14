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

    const gradientClasses = {
        'yellow': 'from-yellow-400 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-600',
        'green': 'from-green-400 to-teal-500 group-hover:from-green-500 group-hover:to-teal-600',
        'red': 'from-red-400 to-rose-500 group-hover:from-red-500 group-hover:to-rose-600',
        'blue': 'from-blue-400 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-600',
    };

    const colorIcon = {
        'yellow': 'text-yellow-400',
        'green': 'text-green-400',
        'red': 'text-red-400',
        'blue': 'text-blue-400',
    }


    return (
        <div className={`
            group rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105
      bg-gradient-to-r ${gradientClasses[bg_clr]}
    `}>
            <div className="flex items-center space-x-4 mb-2">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-white bg-opacity-10 transition-colors duration-300`}>
                    <Icon className={`w-6 h-6 ${colorIcon[bg_clr]}`} />
                </div>
                <div>
                    <h3 className={`text-xl font-bold text-white`}>{title}</h3>
                    <p className="text-sm text-white">{descr}</p>
                </div>
            </div>
            <button
            onClick={onClick}
            className={`mt-4 w-full text-gray-400 cursor-pointer font-semibold py-2 px-4 rounded-lg transition-transform transform-gpu hover:scale-105 shadow-lg flex items-center justify-center border border-white border-opacity-30 bg-white`}>
                <span>Xem chi tiết</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
        </div>
    );
}