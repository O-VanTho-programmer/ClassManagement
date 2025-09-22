import { LucideIcon } from "lucide-react";

interface SquareButtonProps {
    onClick: () => void,
    color: 'blue' | 'gray',
    icon: LucideIcon,
    description?: string,
}

const colorMap: { [key: string]: { style: string, bgColor: string, hoverBg: string, iconColor: string, iconHoverColor: string, tooltipBg: string } } = {
    blue: {
        style: 'text-white',
        bgColor: 'bg-white',
        hoverBg: 'hover:bg-[#3e97ff]',
        iconColor: 'text-[#3e97ff]',
        iconHoverColor: 'group-hover:text-white',
        tooltipBg: 'bg-white'
    },
    gray: {
        style: 'text-gray-500',
        bgColor: 'bg-transparent',
        hoverBg: 'hover:bg-white',
        iconColor: 'text-gray-500',
        iconHoverColor: 'group-hover:text-[#3e97ff]',
        tooltipBg: 'bg-white'
    },
};

export default function SquareButton({ onClick, color, icon, description }: SquareButtonProps) {
    const Icon = icon;
    const styles = colorMap[color];

    return (
        <button onClick={onClick} className={`relative p-2 ${styles.bgColor} ${styles.hoverBg} rounded-md cursor-pointer group`}>
            <Icon className={`${styles.iconColor} ${styles.iconHoverColor}`} />

            {description && (
                <span className={`absolute top-full mt-2 -translate-x-1/2 left-1/2 
                    w-48 p-2 rounded-md text-xs text-black text-center 
                    ${styles.tooltipBg} opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 pointer-events-none`}>
                    {description}
                </span>
            )}
        </button>
    )
}