import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar"

// Ini adalah DashboardLayout
// Layout ini akan membungkus semua halaman di dalam direktori /dashboard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita tidak memanggil komponen <Plasma> di sini.
    // Kita hanya memberikan latar belakang sederhana untuk area dashboard.
    <div>
      <DashboardNavbar />
      <section className="text-color">
        {/* `children` di sini adalah halaman Anda, misalnya `dashboard/page.tsx` atau `dashboard/projects/page.tsx` */}
        {children}
      </section>
    </div>
  );
}
