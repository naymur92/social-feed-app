"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session (like onMounted in Vue)
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) return setLoading(false);

    api("/me", { token: saved })
      .then((u) => { setUser(u); setToken(saved); })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  function saveSession({ user, token }) {
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  }

  async function logout() {
    try { await api("/logout", { method: "POST", token }); } catch { }
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);