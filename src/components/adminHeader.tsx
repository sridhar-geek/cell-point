"use client";
import React from "react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabaseClient";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const AdminHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }

      localStorage.removeItem("supabaseSession");
      deleteCookie("supabaseSession");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="flex justify-between md:justify-end items-center bg-active p-4 shadow-md">
      {/* Mobile Sidebar Toggle Button */}
      <Button className="md:hidden" onClick={toggleSidebar}>
        ☰
      </Button>

      {/* Logout Button (Right Aligned) */}
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
};

export default AdminHeader;
