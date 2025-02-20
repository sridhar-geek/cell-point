"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, FolderClosed, FileText, SquareX } from "lucide-react";
import { Navigation } from "@/lib/types";
import { Button } from "./ui/button";

// navigation names
const navigation = [
  {
    name: "Dashboard",
    routeName: "dashboard",
    route: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "All Products",
    routeName: "products",
    route: "/admin/products",
    icon: <FileText />,
  },
  {
    name: "Categories",
    routeName: "categories",
    route: "/admin/categories",
    icon: <FolderClosed />,
  },
  {
    name: "Banner",
    routeName: "banner",
    route: "/admin/banner",
    icon: <FolderClosed />,
  },
];

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  const [currentPage, setCurrentPage] = useState(lastSegment || "dashboard");

  const handleNavigation = (nav: Navigation) => {
    setCurrentPage(nav.routeName);
    router.push(nav.route);
  };
  return (
    <section>
      {/* Cancel button */}
      <div className="flex justify-end">
        <Button onClick={toggleSidebar} className="md:hidden" variant="ghost">
          <SquareX size="58px" className="text-lg" />
        </Button>
      </div>
      {/* Logo */}
      <Image
        src="/logo.png"
        width={600}
        height={600}
        className="m-0 rounded-xl align-middle cursor-pointer"
        alt="Logo"
        priority={true}
        title="Divya Cell Point"
        onClick={() => router.push("/")}
      />
      {/* Navigation links */}
      <div className="mt-10">
        {navigation?.map((nav, index) => (
          <div
            key={index}
            className={`${
              currentPage === nav.routeName ? "bg-active" : "bg-white"
            } rounded-md px-4 py-1 flex-nowrap p-3 mb-2`}
          >
            <button
              onClick={() => handleNavigation(nav)}
              className="flex gap-3 p-2 text-nowrap"
            >
              {nav.icon}
              {nav.name}{" "}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sidebar;
