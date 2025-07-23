import React, { createContext, useState, useEffect } from "react";
import * as api from "./api";

export const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getUser(token).then(
        (user) => {
          setUser(user);
          setLoading(false);
        },
        () => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          setLoading(false);
        }
      );
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (username, password) => {
    const data = await api.register(username, password);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    if (token) await api.logout(token).catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
