import { useState } from "react";
import { AuthContext } from "./auth-context";
import authService from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("trackitUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ✅ REPLACED: Mock data → Real API call
  const login = async (email, password) => {
    try {
      // Step 1: Verify credentials with backend
      const loginResponse = await authService.login(email, password);

      // Step 2: Check if login was successful (status 200)
      if (loginResponse.status !== 200) {
        return { success: false, message: "Invalid credentials" };
      }

      // Step 3: Fetch full user details by email
      const userData = await authService.getUserByEmail(email);

      // Step 4: Build user object matching your existing structure
      const loggedInUser = {
        id: userData.id,
        email: userData.email,
        name: userData.username,
        role: userData.role,   // Make sure your backend returns role
      };

      // Step 5: Store in state and localStorage
      setUser(loggedInUser);
      localStorage.setItem("trackitUser", JSON.stringify(loggedInUser));

      return { success: true, user: loggedInUser };

    } catch (error) {
      console.error("Login failed:", error);

      // Extract error message from backend response
      const message =
        error.response?.data || "Login failed. Please try again.";

      return { success: false, message };
    }
  };

  // ✅ NEW: Register function
  const register = async (username, email, password, role = "customer") => {
    try {
      const userData = { username, email, password, role };
      const registeredUser = await authService.register(userData);

      const newUser = {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.username,
        role: registeredUser.role,
      };

      // Auto-login after registration
      setUser(newUser);
      localStorage.setItem("trackitUser", JSON.stringify(newUser));

      return { success: true, user: newUser };

    } catch (error) {
      console.error("Registration failed:", error);

      const message =
        error.response?.data || "Registration failed. Please try again.";

      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trackitUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,   // ✅ NEW: Expose register
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}