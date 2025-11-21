"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

// 🔹 Struktur context
interface AuthContextType {
  user: { username: string } | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// 🔹 Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  // 🔹 Ambil user dari cookie saat pertama load
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  // 🔹 Fungsi login → simpan cookie & update state context
  const login = (username: string) => {
    const userObj = { username };
    Cookies.set("user", JSON.stringify(userObj), { expires: 1 });
    setUser(userObj); // ✅ update state supaya Header & Sidebar rerender
  };

  // 🔹 Fungsi logout → hapus cookie & update state
  const logout = () => {
    Cookies.remove("user");
    setUser(null); // ✅ update state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
