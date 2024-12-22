import React, { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaChevronRight } from "react-icons/fa";
import Dashboard from "../ui/dashboard";
import UserProfile from "../ui/UserProfile";
import CompletedPurchases from "../ui/CompletedPurchases";
import PendingOrders from "../ui/PendingPurchases";
import { getIndividual, getOrderStatus } from "@/handler/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import for autoTable
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas"; // Ensure you're using the correct canvas library
import { useAuth } from '../context/AuthContext';
import InTransitOrders from "../ui/InTransitOrders";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export default function IndividualPage() {
  const {isAuthenticated, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchasesDropdownOpen, setPurchasesDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedPurchases, setCompletedPurchases] = useState([]);
  const [IntransitPurchases, setIntransitPurchases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const individual = await getIndividual();
        const individualData = individual[0];

        const payments = individualData.payments || [];

        const pendingOrdersData = payments.filter(
          (payment: any) => payment.order?.order_status === null
        );

        const completedPurchasesData = payments.filter(
          (payment: any) => payment.order?.order_status === "completed"
        );

        const inTransitPurchasesData = payments.filter(
          (payment: any) =>
            ["created", "processing", "packaged", "shipped", "delivered"].includes(payment.order?.order_status)
        );

        setPendingOrders(pendingOrdersData);
        setCompletedPurchases(completedPurchasesData);
        setIntransitPurchases(inTransitPurchasesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const totalPurchases = pendingOrders.length + completedPurchases.length + IntransitPurchases.length;
  const incompletePurchases = pendingOrders.length;
  const ordersInTransit = IntransitPurchases.length;

  const handleCancelRequest = (orderId: any) => {
    setPendingOrders((prevOrders: any) =>
      prevOrders.map((order: any) =>
        order.order.id === orderId ? { ...order, isCancelled: true } : order
      )
    );
  };

  const downloadReceipt = (order: any) => {
    const doc = new jsPDF();

    const canvas = createCanvas(200, 100);
    JsBarcode(canvas, order.order.id, {
      format: "CODE128",
      displayValue: true,
      textAlign: "center",
      textMargin: 5,
      fontSize: 16,
      width: 1,
    });
    const barcodeDataUrl = canvas.toDataURL("image/png");

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 25, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Harmosoft Bookstore", 105, 15, { align: "center" });

    doc.addImage(barcodeDataUrl, "PNG", 75, 35, 60, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("PIN No: P051234567Q", 105, 65, { align: "center" });
    doc.text("VAT Registration No: 123456789", 105, 75, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Order Receipt", 105, 95, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(41, 128, 185);
    doc.line(10, 100, 200, 100);

    doc.setFillColor(240, 240, 240);
    doc.rect(10, 105, 190, 50, "F");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(`Order ID: ${order.order.id}`, 15, 115);
    doc.text(`Recipient: ${order.order.receipient_name}`, 105, 115);

    doc.text(`Email: ${order.order.receipt_email}`, 15, 125);
    doc.text(`Date: ${order.order.date}`, 105, 125);

    doc.text(`Payment Status: ${order.payment_status}`, 15, 135);
    doc.text(`Total: ${order.order.total}`, 105, 135);

    doc.setLineWidth(0.5);
    doc.setDrawColor(41, 128, 185);
    doc.line(10, 155, 200, 155);

    const tableColumn = ["Item Name", "Quantity", "Price", "Total"];
    const tableRows = order.order.items.map((item: any) => [
      item.item.name,
      item.quantity,
      item.item.price,
      (item.quantity * item.item.price).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 160,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    const totalAmount = parseFloat(order.order.total);
    const vatRate = 0.16;
    const vatAmount = totalAmount * vatRate;
    const preVatAmount = totalAmount - vatAmount;

    const vatTableColumn = ["Description", "Amount"];
    const vatTableRows = [
      ["EXCL.Tax", `Ksh. ${preVatAmount.toFixed(2)}`],
      ["VAT (16%)", `Ksh. ${vatAmount.toFixed(2)}`],
      ["INCL.Tax", `Ksh. ${totalAmount.toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [vatTableColumn],
      body: vatTableRows,
      theme: "plain",
      styles: { fontSize: 12, cellPadding: 5, halign: "center" },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 30, 210, 30, "F");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Thank you for shopping with Harmosoft Bookstore!",
      105,
      pageHeight - 20,
      { align: "center" }
    );
    doc.text(
      "For any queries, contact support@harmosoft.com",
      105,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save(`receipt-${order.order.id}.pdf`);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            totalPurchases={totalPurchases}
            completedPurchases={completedPurchases.length}
            incompletePurchases={incompletePurchases}
            ordersInTransit={ordersInTransit}
            pendingOrders={pendingOrders.length}
            setActiveSection={setActiveSection}
          />
        );
      case "profile":
        return <UserProfile />;
      case "completed":
        return (
          <CompletedPurchases
            completedPurchases={completedPurchases}
            downloadReceipt={downloadReceipt}
          />
        );
      case "pending":
        return (
          <PendingOrders
            pendingOrders={pendingOrders}
            handleCancelRequest={handleCancelRequest}
            downloadReceipt={downloadReceipt}
          />
        );
      case "in-transit":
        return (
          <InTransitOrders
            inTransitPurchases={IntransitPurchases}
            trackOrderStatus={getOrderStatus}
          />
        );
      default:
        return (
          <Dashboard
            totalPurchases={totalPurchases}
            completedPurchases={completedPurchases.length}
            incompletePurchases={incompletePurchases}
            ordersInTransit={ordersInTransit}
            pendingOrders={pendingOrders.length}
            setActiveSection={setActiveSection}
          />
        );
    }
  };

  return (
    <div className="flex h-full">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } lg:w-64 h-screen fixed lg:relative top-0 left-0 bg-gray-800 text-white transition-width duration-300 z-20`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className={`font-semibold text-lg ${!sidebarOpen && "hidden"} lg:block`}>
            Dashboard
          </h2>
        </div>
        <nav className={`p-4 ${!sidebarOpen && "hidden"} lg:block`}>
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`block py-2 px-4 ${
              activeSection === "dashboard" ? "bg-green-600" : "hover:bg-gray-700"
            } rounded text-left w-full`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveSection("profile")}
            className={`block py-2 px-4 ${
              activeSection === "profile" ? "bg-green-600" : "hover:bg-gray-700"
            } rounded text-left w-full`}
          >
            User Profile
          </button>

          <div>
            <button
              onClick={() => setPurchasesDropdownOpen(!purchasesDropdownOpen)}
              className="w-full flex justify-between py-2 px-4 hover:bg-gray-700 rounded focus:outline-none text-left"
            >
              <span>My Purchases</span>
              {purchasesDropdownOpen ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {purchasesDropdownOpen && (
              <div className="pl-6">
                <button
                  onClick={() => setActiveSection("completed")}
                  className={`block py-2 px-4 ${
                    activeSection === "completed" ? "bg-green-600" : "hover:bg-gray-700"
                  } rounded text-left w-full`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setActiveSection("pending")}
                  className={`block py-2 px-4 ${
                    activeSection === "pending" ? "bg-green-600" : "hover:bg-gray-700"
                  } rounded text-left w-full`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveSection("in-transit")}
                  className={`block py-2 px-4 ${
                    activeSection === "in-transit" ? "bg-green-600" : "hover:bg-gray-700"
                  } rounded text-left w-full`}
                >
                  In Transit
                </button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="block w-full py-2 px-4 mt-6 bg-red-600 hover:bg-red-700 rounded text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-grow ">
        <div className="flex items-center justify-center relative p-4 bg-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mb-2 px-3 py-2 bg-green-600 text-white rounded-lg absolute left-4"
          >
            <FaBars />
          </button>

          <h1 className="text-3xl font-bold text-green-700 text-center w-full">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </div>

        <div className="p-4">{renderActiveSection()}</div>
      </div>
    </div>
  );
}
