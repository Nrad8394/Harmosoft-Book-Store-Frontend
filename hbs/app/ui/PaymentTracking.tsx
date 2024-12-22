// components/ui/PaymentTracking.tsx
import React, { useState, useEffect } from "react";
import { getPayments, updatePaymentStatus } from "@/handler/Api"; // Import API handler functions

interface Payment {
  id: number;
  orderId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  status: string;
  paymentMethod: string;
}

export default function PaymentTracking() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setError("Unable to load payments. Please try again later.");
    }
  };

  const handleUpdateStatus = async (paymentId: number, status: string) => {
    try {
      await updatePaymentStatus(paymentId, status);
      setPayments(
        payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status } : payment
        )
      );
      setError(null);
    } catch (error) {
      setError("Failed to update payment status. Please try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Payment Tracking</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Payments Tracking Table */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-2 border">Customer Name</th>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Payment Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment Method</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td className="p-2 border">{payment.customerName}</td>
                <td className="p-2 border">{payment.orderId}</td>
                <td className="p-2 border">${payment.amount.toFixed(2)}</td>
                <td className="p-2 border">{payment.paymentDate}</td>
                <td className="p-2 border">
                  <select
                    value={payment.status}
                    onChange={(e) =>
                      handleUpdateStatus(payment.id, e.target.value)
                    }
                    className="border p-1 w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
                <td className="p-2 border">{payment.paymentMethod}</td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() =>
                      handleUpdateStatus(payment.id, payment.status)
                    }
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
