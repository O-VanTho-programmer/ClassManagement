"use client";
import { createContext, useContext } from "react";

const UserContext = createContext<any>(null);
export const useUser = () => useContext(UserContext);

export function UserProvider({ user, children }: { user: any; children: React.ReactNode }) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
