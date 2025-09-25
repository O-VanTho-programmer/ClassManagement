import { BookCheck, BookOpenCheck, BookUser, Dock, UsersRound } from "lucide-react";
import Card from "../Card/Card";
import { CardClass } from "@/types/CardClass";

const cards: CardClass[] = [
    {
        icon: Dock,
        number: 2,
        content: "Total Classes",
        color: 'blue'
    },
    {
        icon: BookOpenCheck,
        number: 2,
        content: "Activating",
        color: 'green'
    },
    {
        icon: BookCheck,
        number: 2,
        content: "Total Student",
        color: 'red'
    },
    {
        icon: UsersRound,
        number: 2,
        content: "Total Student",
        color: 'yellow'
    }
]

export default function ClassesCard() {
    return (
        <div className="">
            <div className="py-3 lg:py-6">
                <h1 className="flex items-center text-lg font-semibold"><BookUser className="text-blue-500 mr-1"/> Classes Management</h1>
                <ul className="flex flex-row items-center bg-transparent text-gray-400 font-semibold">
                    <li className="text-sm"><a href="/">Home Page</a></li>
                    <li className="px-1">-</li>
                    <li className="text-[13px]">Classes Management</li>
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 w-full px-4">
                {cards.map((card, idx) => (
                    <Card key={idx}
                        icon={card.icon} number={card.number}
                        content={card.content} color={card.color} />
                ))}
            </div>
        </div>
    )
}