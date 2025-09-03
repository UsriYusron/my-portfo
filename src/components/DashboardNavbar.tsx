// Pastikan untuk menambahkan "use client" di baris paling atas file
"use client";

import Link from "next/link";
import { useState } from "react";
// Impor usePathname dari next/navigation
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Dapatkan path URL saat ini
  const pathname = usePathname();

  const handleLogout = () => {
    console.log("Logged out");
  };

  // Definisikan kelas untuk link
  const linkClass = (path: string) => 
    pathname === path
      ? "bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium" // Kelas saat aktif
      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"; // Kelas saat tidak aktif

  const mobileLinkClass = (path: string) =>
    pathname === path
      ? "bg-gray-800 text-white block px-3 py-2 rounded-md text-base font-medium" // Kelas mobile saat aktif
      : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"; // Kelas mobile saat tidak aktif


  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-white text-2xl font-bold">
              MyLogo
            </Link>
          </div>

          {/* Menu Navigasi Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/dashboard/certificates" className={linkClass("/dashboard/certificates")}>
                Certificates
              </Link>
              <Link href="/dashboard/projects" className={linkClass("/dashboard/projects")}>
                Projects
              </Link>
              <Link href="/dashboard/blog" className={linkClass("/dashboard/blog")}>
                Blog
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tombol Hamburger untuk Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown untuk Mobile */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/dashboard" className={mobileLinkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/dashboard/certificates" className={mobileLinkClass("/dashboard/certificates")}>
            Certificates
          </Link>
          <Link href="/dashboard/projects" className={mobileLinkClass("/dashboard/projects")}>
            Projects
          </Link>
          <Link href="/dashboard/blog" className={mobileLinkClass("/dashboard/blog")}>
            Blog
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}