// components/ui/Sidebar.tsx
import React from "react";
import { FaListAlt, FaUser } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
  toggleSidebar:()=>void;
}

export default function Sidebar({ setActiveSection, activeSection,toggleSidebar }: SidebarProps) {
  const {isAuthenticated, user, logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Organization Dashboard</h2>
        <ul>
          <li
            className={`cursor-pointer p-2 mb-4 ${activeSection === "dashboard" ? "bg-gray-600" : "bg-gray-800"}`}
            onClick={() => {setActiveSection("dashboard");toggleSidebar();}}
          >
            <FaListAlt className="inline mr-2" /> Shopping Lists
          </li>
          <li
            className={`cursor-pointer p-2 ${activeSection === "profile" ? "bg-gray-600" : "bg-gray-800"}`}
            onClick={() => {setActiveSection("profile");toggleSidebar();}}
          >
            <FaUser className="inline mr-2" /> Profile
          </li>
          <li>
          {/* Logout Button */}
          <button
            onClick={logout}
            className="block w-full py-2 px-4 mt-6 bg-red-600 hover:bg-red-700 rounded text-left"
          >
            Logout
          </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
