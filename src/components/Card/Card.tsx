import { CardClass } from "@/types/CardClass";

const colorMap: { [key: string]: { bg: string; text: string; } } = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
};

export default function Card({ icon, number, content, color }: CardClass) {
    const Icon = icon;
    const colors = colorMap[color];
    return (
        <div className="min-w-[200x] bg-white p-6 rounded-xl border border-gray-300 hover:border-blue-400 flex items-center">
            <div className={`flex items-center justify-center p-2 rounded-xl w-12 h-12 ${colors.bg}`}>
                <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <div className="flex flex-col ml-4">
                <div className="text-xl font-semibold text-slate-900 mb-1">{number}</div>
                <div className="text-sm font-thin text-slate-500">{content}</div>
            </div>
        </div>
    )
}