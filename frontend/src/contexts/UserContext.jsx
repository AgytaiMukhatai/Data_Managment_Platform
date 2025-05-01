// src/contexts/UserContext.jsx
import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "Muster Max",
    username: "muster12",
    email: "muster@example.com",
    profilePic: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
