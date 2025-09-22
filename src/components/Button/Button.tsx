import { LucideIcon } from "lucide-react"

interface ButtonProps {
    title: string,
    icon: LucideIcon,
    onClick: () => void,
}

export default function Button({ title, icon, onClick }: ButtonProps) {

    const Icon = icon;

    return (
        <button onClick={onClick} className="cursor-pointer py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200">
            <span className="flex items-center gap-2">
                <Icon size={20} />
                {title}
            </span>
        </button>
    )
}