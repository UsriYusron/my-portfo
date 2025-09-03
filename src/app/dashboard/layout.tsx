import React from "react"
import DashboardNavbar from "@/components/DashboardNavbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNavbar />
      <main className="p-4">{children}</main>
    </div>
  )
}
