import { LucideIcon } from "lucide-react"

interface ButtonProps {
    title: string,
    icon: LucideIcon,
    onClick: () => void,
    color: "orange" | "blue" | "green" | "blue_off" | "green_off" | "red_off" | "gray"
}
const colorMap: { [key: string]: string } = {
    blue: "text-white bg-blue-500 hover:bg-blue-600",
    orange: "text-white bg-orange-500 hover:bg-orange-600",
    green: "text-white bg-green-500 hover:bg-green-600",
    blue_off: "bg-white border border-blue-400 text-blue-500 hover:bg-blue-100",
    red_off: "bg-white border border-red-400 text-red-500 hover:bg-red-100",
    green_off: "bg-white border border-green-400 text-green-500 hover:bg-green-100",
    gray: "bg-gray-200 text-gray-500 hover:bg-gray-300",
}

export default function Button({ title, icon, onClick, color }: ButtonProps) {
    const styleClr = colorMap[color];
    const Icon = icon;

    return (
        <button onClick={onClick} className={`cursor-pointer py-2 px-4 rounded-lg ${styleClr} transition-colors duration-200`}>
            <span className="flex items-center gap-2">
                <Icon size={20} />
                {title}
            </span>
        </button>
    )
}