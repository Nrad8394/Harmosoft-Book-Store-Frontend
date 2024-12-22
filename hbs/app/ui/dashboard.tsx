import React from "react";
import { FaCheckCircle, FaTimesCircle, FaShoppingCart, FaTruck } from "react-icons/fa";

interface DashboardProps {
  totalPurchases: number;
  completedPurchases: number;
  incompletePurchases: number;
  ordersInTransit: number;
  pendingOrders: number;
  setActiveSection: (section: string) => void; // Add this prop
}

export default function Dashboard({
  totalPurchases,
  completedPurchases,
  incompletePurchases,
  ordersInTransit,
  pendingOrders,
  setActiveSection, // Add this prop
}: DashboardProps) {
  return (
    <div className="w-full p-6 bg-gradient-to-br from-green-50 to-green-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Purchases Card */}
        <button
          onClick={() => setActiveSection("dashboard")}
          className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
        >
          <div className="flex items-center space-x-4">
            <FaShoppingCart className="text-5xl text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Purchases</h3>
              <p className="text-3xl font-bold text-green-600">{totalPurchases}</p>
            </div>
          </div>
        </button>

        {/* Completed Purchases Card */}
        <button
          onClick={() => setActiveSection("completed")}
          className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
        >
          <div className="flex items-center space-x-4">
            <FaCheckCircle className="text-5xl text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Completed Purchases</h3>
              <p className="text-3xl font-bold text-blue-600">{completedPurchases}</p>
            </div>
          </div>
        </button>

        {/* Incomplete Purchases Card */}
        <button
          onClick={() => setActiveSection("pending")}
          className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
        >
          <div className="flex items-center space-x-4">
            <FaTimesCircle className="text-5xl text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Incomplete Purchases</h3>
              <p className="text-3xl font-bold text-red-600">{incompletePurchases}</p>
            </div>
          </div>
        </button>

        {/* Orders in Transit Card */}
        <button
          onClick={() => setActiveSection("in-transit")}
          className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
        >
          <div className="flex items-center space-x-4">
            <FaTruck className="text-5xl text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Orders in Transit</h3>
              <p className="text-3xl font-bold text-yellow-600">{ordersInTransit}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Orders Status Section */}
      <div className="mt-12">
        <h3 className="text-3xl font-bold text-green-800 mb-6">Order Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Orders Card */}
          <button
            onClick={() => setActiveSection("pending")}
            className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
          >
            <h4 className="text-xl font-semibold text-gray-700">Pending Orders</h4>
            <p className="text-4xl font-bold text-yellow-600">{pendingOrders}</p>
            <div className="mt-4 h-4 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${(pendingOrders / totalPurchases) * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {((pendingOrders / totalPurchases) * 100).toFixed(2)}% of total purchases
            </p>
          </button>

          {/* Completed Orders Card */}
          <button
            onClick={() => setActiveSection("completed")}
            className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 focus:outline-none"
          >
            <h4 className="text-xl font-semibold text-gray-700">Completed Orders</h4>
            <p className="text-4xl font-bold text-blue-600">{completedPurchases}</p>
            <div className="mt-4 h-4 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(completedPurchases / totalPurchases) * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {((completedPurchases / totalPurchases) * 100).toFixed(2)}% of total purchases
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
