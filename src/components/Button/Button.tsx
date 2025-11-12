import { LucideIcon } from "lucide-react"

interface ButtonProps {
    title: string,
    style?: string,
    disabled?: boolean,
    icon?: LucideIcon,
    onClick: () => void,
    color: "orange" | "blue" | "green" | "blue_off" | "green_off" | "red_off" | "gray" | "white"
}
const colorMap: { [key: string]: string } = {
    blue: "text-white bg-blue-500 hover:bg-blue-600",
    orange: "text-white bg-orange-500 hover:bg-orange-600",
    green: "text-white bg-green-500 hover:bg-green-600",
    blue_off: "bg-white border border-blue-400 text-blue-500 hover:bg-blue-100",
    red_off: "bg-white border border-red-400 text-red-500 hover:bg-red-100",
    green_off: "bg-white border border-green-400 text-green-500 hover:bg-green-100",
    gray: "bg-gray-200 text-gray-500 hover:bg-gray-300",
    white: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
}

export default function Button({ title, icon, onClick, color, disabled=false, style="" }: ButtonProps) {
    const styleClr = colorMap[color];
    const Icon = icon || null;

    return (
        <button disabled={disabled} type="button" onClick={onClick} className={` ${style} cursor-pointer py-2 px-4 rounded-lg ${styleClr} transition-colors duration-200`}>
            <span className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                {title}
            </span>
        </button>
    )
}