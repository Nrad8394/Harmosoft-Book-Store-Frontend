// components/ui/AdminDashboard.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2'; 
import { CategoryScale, Chart, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaBox, FaMoneyBill, FaTruck, FaSchool, FaWarehouse } from 'react-icons/fa';

// Register the required components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  // Sample chart data (this should come from your backend)
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Orders',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55]
      },
      {
        label: 'Payments',
        backgroundColor: 'rgba(153,102,255,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [28, 48, 40, 19, 86, 27]
      },
      {
        label: 'Procurement',
        backgroundColor: 'rgba(255,159,64,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [35, 42, 70, 50, 80, 65]
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Organizations */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaSchool className="text-4xl text-blue-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Organizations</p>
            <p className="text-2xl font-bold">150</p> {/* Dynamic Data */}
          </div>
        </div>

        {/* Total Individuals */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaUsers className="text-4xl text-purple-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Individuals</p>
            <p className="text-2xl font-bold">500</p> {/* Dynamic Data */}
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaBox className="text-4xl text-green-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Orders</p>
            <p className="text-2xl font-bold">1,250</p> {/* Dynamic Data */}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaTruck className="text-4xl text-red-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Pending Orders</p>
            <p className="text-2xl font-bold">50</p> {/* Dynamic Data */}
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaMoneyBill className="text-4xl text-yellow-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Payments</p>
            <p className="text-2xl font-bold">$45,000</p> {/* Dynamic Data */}
          </div>
        </div>

        {/* Total Procurement */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaWarehouse className="text-4xl text-orange-500 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Procurement</p>
            <p className="text-2xl font-bold">$10,000</p> {/* Dynamic Data */}
          </div>
        </div>
      </div>

      {/* Orders, Payments & Procurement Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Orders, Payments & Procurement Over Time</h3>
        <Bar
          data={data}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Month',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Orders, Payments & Procurement Over the Last 6 Months',
                font: {
                  size: 20
                }
              },
              legend: {
                display: true,
                position: 'right'
              }
            }
          }}
        />
      </div>
    </div>
  );
}
