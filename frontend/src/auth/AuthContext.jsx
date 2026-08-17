import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
  }, [username]);

  async function login(creds) {
    const { data } = await api.post("/token/", creds);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setUsername(creds.username);
  }

  async function register(payload) {
    await api.post("/register/", payload);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setUsername(null);
  }

  const value = {
    username,
    isAuthenticated: Boolean(username && localStorage.getItem("access")),
    ready,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
