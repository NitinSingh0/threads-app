import {  createContext, useState } from "react";

const UserType = createContext();
const UserContext = ({ children }) => {
    const [userId, setUserId] = useState("642d1ef5346d9b20c8a5e5b1");
    return (
        <UserType.Provider value={{userId,setUserId}}>
            {children}
        </UserType.Provider>
    )
}
export {UserType,UserContext}