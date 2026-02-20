"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

type AuthUser = { id: string; email: string } | null;

type AuthContextType = {
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthConsumer({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  const user: AuthUser = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? "",
        email: session.user.email ?? "",
      }
    : null;

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Invalid email or password");
      router.push("/dashboard");
    },
    [router]
  );

  const loginWithGoogle = useCallback(async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  }, []);

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(typeof error === "string" ? error : "Registration failed");
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Registration succeeded but sign-in failed");
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthConsumer>{children}</AuthConsumer>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
