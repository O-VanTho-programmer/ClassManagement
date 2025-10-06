import { useUser } from "@/context/UserContext";
import BirthdayNotification from "../BirthdayNotification/BirthdayNotification";
import CurrentDate from "../CurrentDate/CurrentDate";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import SystemNotification from "../SystemNotification/SystemNotification";
import UserNotification from "../UserNotification/UserNotification";

export default function UserHeader() {
    const user = useUser();

    return (
        <div className="flex items-center gap-2">
            <CurrentDate/>

            <ul className="flex items-center">
                <li><BirthdayNotification/></li>
                <li><SystemNotification/></li>
                <li><UserNotification/></li>
            </ul>

            <HeaderAvatar name={user?.name.charAt(0) || '?'}/>
        </div>
    )
}