import React, { useState, useEffect } from "react";
import Sidebar from "../ui/sidebar";
import ShoppingLists from "../ui/ShoppingLists";
import Profile from "../ui/Profile";
import { FaBars, FaTimes } from "react-icons/fa"; // Import FaTimes for close icon
import { useAuth } from '../context/AuthContext';

export default function OrganizationPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar visibility
  const {isAuthenticated, user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  // Close the sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebarElement = document.getElementById("sidebar");
      if (
        sidebarElement &&
        !sidebarElement.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false); // Close sidebar if clicking outside
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <ShoppingLists />;
      case "profile":
        return <Profile />;
      default:
        return <ShoppingLists />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-0 z-20 bg-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:block ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-64`}
      >
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} toggleSidebar={toggleSidebar}  />

        {/* Close button for mobile sidebar */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={toggleSidebar} className="text-white">
            <FaTimes size={24} /> {/* Close icon */}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full p-6">
        {/* Mobile toggle button */}
        <div className="lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-white bg-green-500 p-2 rounded-full"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h2>
        {renderActiveSection()}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar} // Clicking on the overlay will close the sidebar
        ></div>
      )}

    </div>
  );
}
