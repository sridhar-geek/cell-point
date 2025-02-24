"use client";
import AdminHeader from "@/components/Header/adminHeader";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      {/* Sidebar (Hidden on Mobile) */}
      <aside
        className={`fixed md:relative md:flex flex-col gap-4 min-h-screen w-56 bg-white p-4 z-20 shadow-md transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
