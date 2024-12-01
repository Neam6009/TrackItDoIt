"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import { currUser } from "@/types";


interface UserData {
    email: string;
    id?:string,
    _id?:string
}


interface UserContextProps {
    user: UserData | null;
    setUser: (user: currUser | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);

    // useEffect(() => {
    //     const accessToken = localStorage.getItem("accessToken");
    //     if (accessToken) {
    //         try {
    //             const decoded: UserData = jwtDecode(accessToken);
    //             setUser(decoded); 
    //         } catch (error) {
    //             console.log("decode err")
    //             console.error("Failed to decode token:", error);
    //             localStorage.removeItem("accessToken")
    //         }
    //     }
    // }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
