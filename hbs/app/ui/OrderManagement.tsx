// components/ui/OrderManagement.tsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import { getOrders, updateOrderStatus, deleteOrder } from "@/handler/Api";
import ReactPaginate from 'react-paginate'; // For pagination

interface ItemDetails {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: string;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
  study_level: string;
  curriculum: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  order: string;
  item: ItemDetails;
}

interface Order {
  id: string;
  items: OrderItem[];
  order_status: string;
  date: string;
  payment_status: string;
  total: string;
  receipient_name: string;
  receipt_email: string;
  delivered: boolean;
  grade: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination-related states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Adjust the number of orders per page

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Unable to load orders. Please try again later.");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, order_status: status } : order
        )
      );
      setError(null);
    } catch (error) {
      setError("Failed to update order status. Please try again.");
    }
  };

  const handleDeleteOrder = async (orderId: any) => {
    const confirmed = confirm("Are you sure you want to delete this order?");
    if (confirmed) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter((order) => order.id !== orderId));
        setError(null);
      } catch (error) {
        setError("Failed to delete the order. Please try again.");
      }
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Pagination logic
  const pageCount = Math.ceil(orders.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const paginatedOrders = orders.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const filteredOrders =
    filterStatus === "all"
      ? paginatedOrders
      : paginatedOrders.filter((order) => order.order_status === filterStatus);

  return (
    <div className="container mx-auto px-4 py-6">
      {selectedOrder ? (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p><strong>Order ID:</strong> {selectedOrder.id}</p>
          <p><strong>Recipient Name:</strong> {selectedOrder.receipient_name}</p>
          <p><strong>Recipient Email:</strong> {selectedOrder.receipt_email}</p>
          <p><strong>Total Amount:</strong> ${selectedOrder.total}</p>
          <p><strong>Order Status:</strong> {selectedOrder.order_status}</p>
          <p className="font-semibold mt-4">Items:</p>
          {selectedOrder.items.map((item) => (
            <div key={item.id} className="mb-4 p-2 bg-gray-100 rounded-lg">
              <img src={item.item.image} alt={item.item.name} className="w-16 h-16 mb-2" />
              <p><strong>Name:</strong> {item.item.name}</p>
              <p><strong>SKU:</strong> {item.item.sku}</p>
              <p><strong>Description:</strong> {item.item.description}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.item.price}</p>
              <p><strong>Category:</strong> {item.item.category}</p>
            </div>
          ))}
          <button
            className="bg-red-500 text-white p-2 rounded mt-4"
            onClick={closeOrderDetails}
          >
            Back to Orders
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-4">Order Management</h3>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Status Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="all">All</option>
              <option value="created">Created</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Items</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Order Status</th>
                  <th className="p-2 border">Recipient</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-2 border">{order.id}</td>
                      <td className="p-2 border">
                        {order.items.map((item) => (
                          <p key={item.id}>Item: {item.item.name}, Qty: {item.quantity}</p>
                        ))}
                      </td>
                      <td className="p-2 border">${order.total}</td>
                      <td className="p-2 border">{order.order_status}</td>
                      <td className="p-2 border">
                        {order.receipient_name} ({order.receipt_email})
                      </td>
                      <td className="p-2 border flex space-x-2">
                        <button
                          className="bg-blue-500 text-white p-1 rounded"
                          onClick={() => openOrderDetails(order)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="bg-green-500 text-white p-1 rounded"
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                        >
                          Mark as Delivered
                        </button>
                        <button
                          className="bg-red-500 text-white p-1 rounded"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName="inline-block mx-1"
              previousClassName="inline-block mx-1"
              nextClassName="inline-block mx-1"
            />
          </div>
        </>
      )}
    </div>
  );
}
