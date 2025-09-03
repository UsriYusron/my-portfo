"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Kamu belum login. Silakan login dulu.</p>;
  }

  return (
    <div>
      <h1>Selamat datang di Dashboard 🎉</h1>
      <p>Email: {session.user?.email}</p>

      <button onClick={() => signOut({ callbackUrl: "/login" })}>
        Logout
      </button>
    </div>
  );
}
