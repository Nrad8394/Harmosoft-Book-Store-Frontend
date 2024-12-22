import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClipboardList,
  FaShippingFast,
  FaHourglassHalf,
} from "react-icons/fa";
import { getOrderStatus } from "@/handler/Api"; // Import the API handler

interface OrderStep {
  id: string;
  step_name: string;
  completed: boolean;
  timestamp: string;
  order: string;
}

interface OrderItem {
  id: string | number;
  quantity: number;
  item: any;
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
  steps: OrderStep[];
}

interface Purchase {
  order: Order;
  payment_status: string;
}

interface InTransitOrdersProps {
  inTransitPurchases: Purchase[];
  trackOrderStatus: (orderId: string) => Promise<OrderStep[]>;
}

const defaultSteps = [
  "Order Created",
  "processing",
  "packaged",
  "shipped",
  "delivered",
  "completed"
];

const InTransitOrders: React.FC<InTransitOrdersProps> = ({
  inTransitPurchases,
  trackOrderStatus,
}) => {
  const [orderSteps, setOrderSteps] = useState<OrderStep[]>([]);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (inTransitPurchases.length > 0) {
        const steps = await trackOrderStatus(inTransitPurchases[0].order.id);
        if (steps) {
          const mappedSteps = defaultSteps.map((stepName) => {
            const foundStep = steps.find((step) => step.step_name === stepName);
            return foundStep
              ? { ...foundStep, completed: foundStep.completed, timestamp: foundStep.timestamp }
              : { id: stepName, step_name: stepName, completed: false, order: inTransitPurchases[0].order.id, timestamp: '' };
          });
          setOrderSteps(mappedSteps);
        }
      }
    };
  
    fetchOrderStatus();
  }, [inTransitPurchases, trackOrderStatus]); // Added 'trackOrderStatus' to the dependency array
  
  const renderOrderStepIcon = (
    stepName: string,
    completed: boolean,
    isCurrent: boolean
  ) => {
    const baseClass = "text-xs sm:text-3xl";
    const completedClass = completed
      ? "text-green-500"
      : isCurrent
      ? "text-blue-500"
      : "text-gray-400";

    switch (stepName) {
      case "Order Created":
        return <FaClipboardList className={`${baseClass} ${completedClass}`} />;
      case "processing":
        return <FaHourglassHalf className={`${baseClass} ${completedClass}`} />;
      case "packaged":
        return <FaBox className={`${baseClass} ${completedClass}`} />;
      case "shipped":
        return <FaTruck className={`${baseClass} ${completedClass}`} />;
      case "delivered":
        return <FaShippingFast className={`${baseClass} ${completedClass}`} />;
      case "completed":
        return <FaCheckCircle className={`${baseClass} ${completedClass}`} />;
      default:
        return null;
    }
  };

  const renderOrderSteps = (steps: OrderStep[]) => {
    const currentStepIndex = steps.findIndex((step) => !step.completed);

    return (
      <div className="flex justify-between items-center mt-4">
        {steps.map((step, index) => (
          <div key={step.id} className="text-center flex flex-col items-center">
                {renderOrderStepIcon(step.step_name, step.completed, index === currentStepIndex)}
                <span className="text-xs sm:text-sm mt-2">{step.step_name}</span>
                {index === currentStepIndex && (
                    <span className="text-blue-500 font-semibold mt-1 text-xs sm:text-xl">
                    (In Progress)
                    </span>
                )}
                {index < currentStepIndex && (
                    <span className="text-green-500 font-semibold mt-1 text-xs sm:text-xl">
                    (Completed)
                    </span>
                )}
                {index > currentStepIndex && (
                    <span className="text-gray-500 font-semibold mt-1 text-xs sm:text-xl">
                    (Pending)
                    </span>
                )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-1 sm:p-4 rounded-lg shadow-md">
      {inTransitPurchases.length === 0 ? (
        <div className="text-center p-1 sm:p-4 bg-white rounded-md shadow-md">
          <p className="text-lg text-gray-600">
            You have no in-transit orders at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {inTransitPurchases.map((purchase: any) => (
            <div
              key={purchase.order.id}
              className="bg-white p-1 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
                  <FaTruck className="text-2xl sm:text-3xl text-green-500" />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-green-700">
                      KSH {purchase.order.total}
                    </h4>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold mb-2">Items in Order:</h4>
                <ul className="space-y-2">
                  {purchase.order.items.map((item: any) => (
                    
                    <li
                      key={item.item.name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{item.item.name}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold mb-2">Order Progress:</h4>
                <div className="bg-gray-200 p-1 rounded-lg">
                  {renderOrderSteps(orderSteps)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InTransitOrders;
