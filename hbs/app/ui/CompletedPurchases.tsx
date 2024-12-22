import React from "react";
import { FaDownload, FaMoneyCheckAlt } from "react-icons/fa";

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
  item: Item;
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

interface CompletedPurchasesProps {
  completedPurchases: Purchase[];
  downloadReceipt: (purchase: Purchase) => void;
}

const CompletedPurchases: React.FC<CompletedPurchasesProps> = ({
  completedPurchases,
  downloadReceipt,
}) => {
  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
        Your Completed Purchases
      </h2>

      {completedPurchases.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-md shadow-md">
          <p className="text-lg text-gray-600">
            You have no completed purchases at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {completedPurchases.map((purchase: any) => (
            <div
              key={purchase.order.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Order ID: {purchase.order.id}
                  </h3>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Date:</strong> {purchase.order.date}
                  </p>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Payment Status:</strong> {purchase.payment_status}
                  </p>
                  <p className="text-sm mb-2 text-gray-600">
                    <strong>Recipient:</strong> {purchase.order.receipient_name}
                  </p>
                  <p className="text-sm mb-4 text-gray-600">
                    <strong>Email:</strong> {purchase.order.receipt_email}
                  </p>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <FaMoneyCheckAlt className="text-2xl sm:text-3xl text-green-500" />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-green-700">
                      KSH {purchase.order.total}
                    </h4>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold mb-2">Items Purchased:</h4>
                <ul className="space-y-2">
                  {purchase.order.items.map((item: any) => (
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

              <div className="mt-6 text-right">
                <button
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => downloadReceipt(purchase)}
                >
                  <FaDownload className="mr-2" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedPurchases;
