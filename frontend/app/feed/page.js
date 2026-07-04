"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";

export default function FeedPage() {
  const { user, logout } = useAuth();
  return (
    <RequireAuth>
      <div>
        <p>Welcome {user?.full_name}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </RequireAuth>
  );
}