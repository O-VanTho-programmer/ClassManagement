import { useState } from "react";
import SquareButton from "../SquareButton/SquareButton";
import NotificationList from "../NotificationList/NotificationList";
import { Bell } from "lucide-react";

export default function UserNotification() {
    const [dropMenu, setDropMenu] = useState(false);

    return(
        <div className="relative">
            <SquareButton onClick={() => setDropMenu(true)} color="gray" icon={Bell}  />
            <NotificationList isOpen={dropMenu} onClose={() => setDropMenu(false)} title="Thông báo từ hệ thống"/>
        </div>
    )
}