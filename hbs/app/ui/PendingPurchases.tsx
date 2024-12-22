import React from "react";
import { FaTimesCircle, FaTruck, FaDownload } from "react-icons/fa";

interface Item {
  sku: string;
  name: string;
  description: string;
  price: string;
  visibility: boolean;
  stock_availability: boolean;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
  study_level: string;
  cirriculum: string;
}

interface OrderItem {
  id: string | number;
  quantity: number;
  item: Item; // Updated to reflect the actual structure of item
}

interface Order {
  id: string;
  date: string;
  order_status: string;
  total: string;
  payment_status: string;
  receipient_name: string;
  receipt_email: string;
  items: OrderItem[];
}

interface Purchase {
  order: Order;
  payment_status: string;
}

interface PendingOrder extends Purchase {
  isCancelled: boolean;
}

interface PendingOrdersProps {
  pendingOrders: PendingOrder[];
  handleCancelRequest: (orderId: string) => void;
  downloadReceipt: (order: PendingOrder) => void;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({
  pendingOrders,
  handleCancelRequest,
  downloadReceipt,
}) => {
  return (
    <div className="bg-gray-100 p-4 sm:p-2 rounded-lg shadow-md mb-8">
      {pendingOrders.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-md shadow-md">
          <p className="text-lg text-gray-600">
            You have no pending orders at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {pendingOrders.map((order) => (
            <div
              key={order.order.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Order ID: {order.order.id}
                  </h3>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Date:</strong> {order.order.date}
                  </p>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Payment Status:</strong> {order.payment_status}
                  </p>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Recipient:</strong> {order.order.receipient_name}
                  </p>
                  <p className="text-sm mb-4 text-gray-600">
                    <strong>Email:</strong> {order.order.receipt_email}
                  </p>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <FaTruck className="text-2xl sm:text-3xl text-yellow-500" />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-yellow-700">
                      KSH {order.order.total}
                    </h4>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold mb-2">Items in this Order:</h4>
                <ul className="space-y-2">
                  {order.order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.item.name}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <button
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => downloadReceipt(order)}
                >
                  <FaDownload className="mr-2" />
                  <span>Download Receipt</span>
                </button>

                {!order.isCancelled && (
                  <button
                    className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => handleCancelRequest(order.order.id)}
                  >
                    <FaTimesCircle className="mr-2" />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
