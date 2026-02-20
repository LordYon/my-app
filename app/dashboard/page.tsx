"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="rounded-xl bg-white p-8 shadow text-center space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 text-sm">
          Signed in as <span className="font-medium">{user?.email}</span>
        </p>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-black py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
