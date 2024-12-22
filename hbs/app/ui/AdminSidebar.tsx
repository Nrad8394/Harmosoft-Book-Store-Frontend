// components/ui/AdminSidebar.tsx
import React from "react";
import { FaClipboardList, FaTruck, FaDollarSign, FaWarehouse, FaSchool } from "react-icons/fa";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void; // for mobile sidebar toggling
}

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  toggleSidebar,
}: AdminSidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <FaSchool />, section: "dashboard" },
    { name: "Organization Management", icon: <FaSchool />, section: "organizationManagement" },
    { name: "Order Management", icon: <FaClipboardList />, section: "orderManagement" },
    { name: "Order Tracking", icon: <FaTruck />, section: "orderTracking" },
    { name: "Payment Tracking", icon: <FaDollarSign />, section: "paymentTracking" },
    { name: "Procurement Management", icon: <FaWarehouse />, section: "procurementManagement" },
  ];

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
    toggleSidebar(); // Close the sidebar after clicking on a link (for mobile)
  };

  return (
    <div className="h-full bg-gray-900 text-white w-64">
      <h3 className="text-xl font-bold p-4">Admin Dashboard</h3>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.section}
            className={`p-4 flex items-center space-x-2 cursor-pointer hover:bg-gray-700 ${
              activeSection === item.section ? "bg-gray-700" : ""
            }`}
            onClick={() => handleMenuClick(item.section)}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
