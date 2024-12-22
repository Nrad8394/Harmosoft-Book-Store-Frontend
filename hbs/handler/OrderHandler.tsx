import { useState, useEffect } from 'react';
import { createOrder, getOrder, updateOrder } from '@/handler/Api'; // Import the necessary API functions
import { message } from 'antd';

interface BookEntry {
  sku: string;
  quantity: number;
}

interface OrderHandlerProps {
  books: BookEntry[];
  deliveryData: {
    childName: string;
    email: string;
    deliveryMethod: string;
    deliveryLocation?: string;
    phoneNumber?: string;
    schoolId?: string;
    grade?: string;
  };
  onOrderCreated: (orderId: string) => void; // Callback to handle order creation
}

export default function OrderHandler({ books, deliveryData, onOrderCreated }: OrderHandlerProps) {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Fetch existing order from sessionStorage when the component mounts
  useEffect(() => {
    const existingOrderId = sessionStorage.getItem('orderId');
    if (existingOrderId) {
      setOrderId(existingOrderId);
    }
  }, []);

  const handleOrder = async () => {
    setLoading(true);

    try {
      // Prepare order items from the selected books
      const orderItems = books.map((book) => ({
        item_id: book.sku,
        quantity: book.quantity,
      }));

      let orderData: any = {
        items: orderItems,
        receipient_name: deliveryData.childName,
        receipt_email: deliveryData.email,
      };

      // Add additional fields based on the delivery method
      if (deliveryData.deliveryMethod === 'school') {
        orderData.organization = deliveryData.schoolId;
        orderData.grade = deliveryData.grade;
      } else if (deliveryData.deliveryMethod === 'home') {
        orderData.delivery_location = deliveryData.deliveryLocation;
        orderData.phone_number = deliveryData.phoneNumber;
      }

      // If there is no existing order, create a new order
      if (!orderId) {
        const newOrder = await createOrder(orderData);
        message.success('Order created successfully');
        setOrderId(newOrder.id);
        sessionStorage.setItem('orderId', newOrder.id); // Persist the order ID in sessionStorage
        onOrderCreated(newOrder.id);
      } else {
        // Update the existing order if it already exists
        const updatedOrder = await updateOrder(orderId, orderData);
        message.success('Order updated successfully');
        onOrderCreated(orderId); // Invoke callback to notify parent
      }
    } catch (error) {
      console.error('Error handling order:', error);
      message.error('An error occurred while processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleOrder}
        className="px-4 py-2 bg-green-700 text-white rounded-md"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
