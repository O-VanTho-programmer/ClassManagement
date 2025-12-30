import { useUser } from "@/context/UserContext";
import BirthdayNotification from "../BirthdayNotification/BirthdayNotification";
import CurrentDate from "../CurrentDate/CurrentDate";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import SystemNotification from "../SystemNotification/SystemNotification";
import UserNotification from "../UserNotification/UserNotification";
import LogoutBTN from "../LogoutBTN/LogoutBTN";
import { useState } from "react";

export default function UserHeader() {
    const user = useUser();
    const [userDropdown, setUserDropdown] = useState<boolean>(false);

    return (
        <div className="flex items-center gap-2">
            <CurrentDate />

            <ul className="flex items-center">
                <li><BirthdayNotification /></li>
                <li><SystemNotification /></li>
                <li><UserNotification /></li>
            </ul>

            <div className="relative">
                <div onClick={() => setUserDropdown(!userDropdown)} className="cursor-pointer">
                    <HeaderAvatar name={user?.name.charAt(0) || '?'} />
                </div>

                {userDropdown && (
                    <>
                        <ul className="absolute z-10 right-0 mt-1 py-1 min-w-[150px] bg-white overflow-hidden rounded-xl border-2 border-blue-500 shadow">
                            <li className="text-center py-1 cursor-pointer hover:bg-gray-200">My Profile</li>
                            <li className="text-center py-1 cursor-pointer hover:bg-gray-200"><LogoutBTN /></li>
                        </ul>
                    </>
                )}
            </div>
            {userDropdown && (
                <div onClick={() => setUserDropdown(false)} className="absolute h-screen w-screen top-0 left-0 bg-transparent"></div>
            )}
        </div>

    )
}