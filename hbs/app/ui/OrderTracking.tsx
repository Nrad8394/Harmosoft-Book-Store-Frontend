// components/ui/OrderTracking.tsx
import React, { useState, useEffect } from "react";
import { getOrders, updateTrackingInfo } from "@/handler/Api";

interface Order {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  expectedDelivery?: string;
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleUpdateTracking = async (orderId: number, trackingNumber: string, shippingCarrier: string, expectedDelivery: string) => {
    try {
      await updateTrackingInfo(orderId, trackingNumber, shippingCarrier, expectedDelivery);
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, trackingNumber, shippingCarrier, expectedDelivery }
            : order
        )
      );
      setError(null);
    } catch (error) {
      setError("Failed to update tracking information. Please try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Order Tracking</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Orders Tracking Table */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-2 border">Customer Name</th>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Tracking Number</th>
            <th className="p-2 border">Shipping Carrier</th>
            <th className="p-2 border">Expected Delivery</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.customerName}</td>
                <td className="p-2 border">{order.productName}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={order.trackingNumber || ""}
                    onChange={(e) =>
                      handleUpdateTracking(order.id, e.target.value, order.shippingCarrier || "", order.expectedDelivery || "")
                    }
                    className="border p-1 w-full"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={order.shippingCarrier || ""}
                    onChange={(e) =>
                      handleUpdateTracking(order.id, order.trackingNumber || "", e.target.value, order.expectedDelivery || "")
                    }
                    className="border p-1 w-full"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="date"
                    value={order.expectedDelivery || ""}
                    onChange={(e) =>
                      handleUpdateTracking(order.id, order.trackingNumber || "", order.shippingCarrier || "", e.target.value)
                    }
                    className="border p-1 w-full"
                  />
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() =>
                      handleUpdateTracking(order.id, order.trackingNumber || "", order.shippingCarrier || "", order.expectedDelivery || "")
                    }
                  >
                    Update
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
  );
}
