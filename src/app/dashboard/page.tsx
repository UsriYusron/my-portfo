"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const Certificates = dynamic(() => import("@/components/certificates"), {
  loading: () => <p className="text-white text-center">Memuat sertifikat...</p>,
});
const Projects = dynamic(() => import("@/components/projects"), {
  loading: () => <p className="text-white text-center">Memuat proyek...</p>,
});

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeView, setActiveView] = useState<"projects" | "certificates" | null>(null);

  if (!session) {
    return <p className="text-white text-center">Anda harus login untuk melihat halaman ini.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang di Dasbor Anda</h1>
        <p className="text-gray-400">Email: {session.user?.email}</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={() => setActiveView("projects")} variant={activeView === "projects" ? "default" : "outline"}>
          Proyek Saya
        </Button>
        <Button onClick={() => setActiveView("certificates")} variant={activeView === "certificates" ? "default" : "outline"}>
          Sertifikat Saya
        </Button>
      </div>

      <div>
        {activeView === "projects" && <Projects />}
        {activeView === "certificates" && <Certificates />}
      </div>
    </div>
  );
}
