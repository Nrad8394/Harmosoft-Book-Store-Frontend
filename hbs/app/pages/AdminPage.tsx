// components/pages/AdminPage.tsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../ui/AdminSidebar";
import OrganizationManagement from "../ui/OrganizationManagement";
import OrderManagement from "../ui/OrderManagement";
import OrderTracking from "../ui/OrderTracking";
import PaymentTracking from "../ui/PaymentTracking";
import ProcurementManagement from "../ui/ProcurementManagement";
import AdminDashboard from "../ui/AdminDashboard";
import { FaBars, FaTimes } from "react-icons/fa"; 
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebarElement = document.getElementById("sidebar");
      if (
        sidebarElement &&
        !sidebarElement.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
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
        return <AdminDashboard />;
      case "organizationManagement":
        return <OrganizationManagement />;
      case "orderManagement":
        return <OrderManagement />;
      case "orderTracking":
        return <OrderTracking />;
      case "paymentTracking":
        return <PaymentTracking />;
      case "procurementManagement":
        return <ProcurementManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`min-h-screen fixed inset-0 z-20 bg-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:block ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-64`}
      >
        <AdminSidebar
          setActiveSection={setActiveSection}
          activeSection={activeSection}
          toggleSidebar={toggleSidebar}
        />

        {/* Close button for mobile sidebar */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={toggleSidebar} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full p-6">
        {/* Mobile toggle button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="text-white bg-green-500 p-2 rounded-full"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Section title */}
        <h2 className="text-3xl font-bold mb-4">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/([A-Z])/g, ' $1').trim()}
        </h2>

        {/* Render active section */}
        {renderActiveSection()}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
