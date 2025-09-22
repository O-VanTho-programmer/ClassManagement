import BirthdayNotification from "../BirthdayNotification/BirthdayNotification";
import CurrentDate from "../CurrentDate/CurrentDate";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import SystemNotification from "../SystemNotification/SystemNotification";
import UserNotification from "../UserNotification/UserNotification";

export default function UserHeader() {
    return (
        <div className="flex items-center gap-2">
            <CurrentDate/>

            <ul className="flex items-center">
                <li><BirthdayNotification/></li>
                <li><SystemNotification/></li>
                <li><UserNotification/></li>
            </ul>

            <HeaderAvatar/>
        </div>
    )
}