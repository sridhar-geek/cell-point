"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Loading } from "../Skeleton/loading";

const AdminHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <header className=" bg-active p-4 shadow-md">
      {/* Mobile Sidebar Toggle Button */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-between md:justify-end items-center">
          <Button className="md:hidden" onClick={toggleSidebar}>
            ☰
          </Button>

          {/* Logout Button (Right Aligned) */}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
