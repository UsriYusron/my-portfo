"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Kamu belum login. Silakan login dulu.</p>;
  }

  return (
    <div className="text-white text-2xl font-bold mb-4 text-center">
      <h1>Selamat datang di Dashboard 🎉</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
