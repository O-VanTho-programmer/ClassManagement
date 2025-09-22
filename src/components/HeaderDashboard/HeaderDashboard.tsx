import { School } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import UserHeader from "../UserHeader/UserHeader";
import Button from "../Button/Button";

export default function HeaderDashboard() {
    const onClick = () => {
        return null;
    }
    return (
        <div className="bg-white h-[75px] gap-2 justify-between flex items-center px-[20px] md:px-[30px]">
            <div className="flex gap-1 items-center">
                <Button icon={School} onClick={onClick} title="Classes" />
                <Button icon={School} onClick={onClick} title="Classes" />
            </div>

            <SearchBar />
            <UserHeader/>

        </div>
    )
}