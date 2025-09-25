import { School } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import UserHeader from "../UserHeader/UserHeader";
import Button from "../Button/Button";

export default function HeaderDashboard() {
    const onClick = () => {
        return null;
    }
    return (
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 h-[72px]">
            <div className="container h-full flex items-center justify-between gap-3">
                <div className="flex gap-2 items-center">
                    <Button color="blue" icon={School} onClick={onClick} title="Classes" />
                </div>
                <div className="flex-1 max-w-[600px]"><SearchBar /></div>
                <UserHeader/>
            </div>
        </div>
    )
}