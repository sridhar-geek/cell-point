import React from 'react'
import { Button } from './ui/button'

const AdminHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="flex justify-between md:justify-end items-center bg-active p-4 shadow-md">
      {/* Mobile Sidebar Toggle Button */}
      <Button className="md:hidden" onClick={toggleSidebar}>
        ☰
      </Button>

      {/* Logout Button (Right Aligned) */}
      <Button>Logout</Button>
    </header>
  );
};

export default AdminHeader