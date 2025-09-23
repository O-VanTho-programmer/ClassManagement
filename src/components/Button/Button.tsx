import { LucideIcon } from "lucide-react"

interface ButtonProps {
    title: string,
    icon: LucideIcon,
    onClick: () => void,
    color: "blue" | "blue_off" | "green_off"
}
const colorMap: { [key: string]: string} = {
    blue: "text-white bg-blue-500 hover:bg-blue-600",
    blue_off: "bg-white border border-blue-400 text-blue-500 hover:bg-blue-100",
    green_off: "bg-white border border-green-400 text-green-500 hover:bg-green-100",
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