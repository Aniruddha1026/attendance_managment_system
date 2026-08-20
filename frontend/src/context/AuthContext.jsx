import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("username")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = async (username, password) => {
    const response = await api.post(
      "/api/auth/login",
      {
        username,
        password,
      }
    );

    const token = response.data.access_token;

    const decoded = jwtDecode(token);

    localStorage.setItem("access_token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", decoded.role);

    setUser(username);
    setRole(decoded.role);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: role === "admin",
        isViewer: role === "viewer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}