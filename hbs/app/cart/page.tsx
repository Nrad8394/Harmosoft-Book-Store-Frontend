"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { FaTrashAlt } from "react-icons/fa"; 
import Image from "next/image";
import { Button, InputNumber, Modal } from "antd"; // Added Modal component
import CheckoutModal from "../ui/checkout";

const CartPage: React.FC = () => {
  const { cartItems, quantities, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false); // State for modal visibility

  // Function to calculate total cost per item (price * quantity)
  const calculateItemTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  // Function to calculate the total price of the entire cart
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(Number(item.price), quantities[item.sku] || 1);
    }, 0);
  };

  const handleQuantityChange = (sku: string, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(sku, quantity); 
    }
  };

  const handleRemoveItem = (sku: string) => {
    removeFromCart(sku); 
  };

  const handleClearCart = () => {
    clearCart(); 
  };

  const handleCheckout = () => {
    setIsCheckoutVisible(true); // Show the checkout modal
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-center">Your Shopping Cart</h1>
        <Button
          type="primary"
          size="large"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Publisher</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.sku} className="border-b">
                  <td className="p-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </td>
                  <td className="p-4">
                    <p className="text-lg font-semibold">{item.name}</p>
                  </td>
                  <td className="p-4">
                    <p>{item.category}</p>
                  </td>
                  <td className="p-4">
                    <p>{item.publisher}</p>
                  </td>
                  <td className="p-4 text-center">
                    <p>Ksh {item.price}</p>
                  </td>
                  <td className="p-4 text-center">
                    <InputNumber
                      min={1}
                      value={quantities[item.sku]}
                      onChange={(value) => handleQuantityChange(item.sku, value as number)}
                      className="w-16"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <p>Ksh {calculateItemTotal(Number(item.price), quantities[item.sku] || 1)}</p>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      aria-label="remove Item"
                      onClick={() => handleRemoveItem(item.sku)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cart Total */}
          <div className="mt-8 flex justify-end items-center space-x-4">
            <div className="text-xl font-semibold">
              <p>Total: Ksh {calculateCartTotal()}</p>
            </div>
            <Button danger onClick={handleClearCart} className="bg-red-600 text-white">
              Clear Cart
            </Button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={isCheckoutVisible}
        onCancel={() => setIsCheckoutVisible(false)} // Close modal on cancel
        footer={null}
        width={800} // Set appropriate width for the modal
        centered
      >
        <CheckoutModal onClose={() => setIsCheckoutVisible(false)} /> {/* Pass onClose as a prop */}
      </Modal>
    </main>
  );
};

export default CartPage;
