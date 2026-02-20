"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthUser = { id: string; email: string } | null;

type AuthContextType = {
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser?: AuthUser }) {
  const [user, setUser] = useState<AuthUser>(initialUser ?? null);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(typeof error === "string" ? error : "Login failed");
    }
    const data = await res.json();
    setUser(data);
    router.push("/dashboard");
  }, [router]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(typeof error === "string" ? error : "Registration failed");
    }
    const data = await res.json();
    setUser(data);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
