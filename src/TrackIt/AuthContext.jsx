import { useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("trackitUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email) => {
    const mockUsers = {
      "customer@trackit.com": {
        id: "1",
        email,
        name: "John Smith",
        role: "customer",
      },
    };

    const foundUser = mockUsers[email];
    if (!foundUser) return false;

    setUser(foundUser);
    localStorage.setItem("trackitUser", JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trackitUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
