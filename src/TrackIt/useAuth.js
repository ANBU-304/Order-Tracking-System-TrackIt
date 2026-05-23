// src/hooks/useAuth.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9090/api/auth";

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      //  LOGIN
      login: async (email, password) => {
        try {
          const response = await authService.login(email, password);
          const token = response.headers["authorization"];
          const user = response.data;

          if (!token || !user) {
            return {
              success: false,
              message: "Invalid credentials or server error",
            };
          }

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          set({ user, token, isAuthenticated: true });

          return { success: true, user, token };
        } catch (error) {
          console.error("Login error:", error);
          return {
            success: false,
            message:
              error.response?.data?.message ||
              "Login failed. Please check your credentials.",
          };
        }
      },

      // ✅ REGISTER
      register: async (name, email, password, role = "customer") => {
        try {
          const userData = { name, email, password, role };
          await authService.register(userData);

          // Auto-login after registration
          return await get().login(email, password);
        } catch (error) {
          console.error("Registration error:", error);
          return {
            success: false,
            message:
              error.response?.data?.message ||
              error.response?.data ||
              "Registration failed. Email may already be in use.",
          };
        }
      },

      // ✅ FORGOT PASSWORD
      forgotPassword: async (email) => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/forgot-password`,
            { email }
          );
          return {
            success: true,
            message:
              response.data ||
              "If the email exists, a new password has been sent.",
          };
        } catch (error) {
          console.error("Forgot password error:", error);
          return {
            success: false,
            message:
              error.response?.data?.message ||
              "Failed to process request. Please try again later.",
          };
        }
      },

      // ✅ LOGOUT
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = "/login";
      },

      // ✅ UPDATE USER
      updateUser: async (id, userData) => {
        try {
          const updatedUser = await authService.updateUser(id, userData);
          set({ user: updatedUser });
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return { success: true, user: updatedUser };
        } catch (error) {
          console.error("Update error:", error);
          return {
            success: false,
            message: "Failed to update user information",
          };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);