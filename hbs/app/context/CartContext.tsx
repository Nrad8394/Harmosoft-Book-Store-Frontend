"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { notification } from "antd"; // Import Ant Design notification

interface CartItem {
  sku: string;
  name: string;
  description?: string;
  price: string;
  quantity: number;
  visibility: boolean;
  stock_availability: boolean;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
  curriculum: string;
  study_level: string;
}

interface CartContextType {
  cartItems: CartItem[];
  quantities: { [sku: string]: number };
  addToCart: (item: CartItem, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [sku: string]: number }>({});

  // Initialize cart items and quantities from localStorage on mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    const savedQuantities = localStorage.getItem("quantities");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    if (savedQuantities) {
      setQuantities(JSON.parse(savedQuantities));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("quantities", JSON.stringify(quantities));
    }, 300); // Delay of 300ms before saving
  
    return () => clearTimeout(timer); // Clear the timeout if state changes again before saving
  }, [cartItems, quantities]);
  const addToCart = (item: CartItem, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.sku === item.sku);
      if (existingItem) {
        updateQuantity(item.sku, quantities[item.sku] + quantity); // Update quantity directly
        notification.info({
          message: 'Item Updated in Cart',
          description: `${item.name} quantity updated to ${quantities[item.sku] + quantity}.`,
          duration: 2,
        });
        return prevItems; // No need to add the item again, just return the same list
      } else {
        notification.success({
          message: 'Item Added to Cart',
          description: `${item.name} has been added to your cart.`,
          duration: 2,
        });
        return [...prevItems, item]; // Add the new item
      }
    });

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.sku]: (prevQuantities[item.sku] || 0) + quantity,
    }));
  };

  const removeFromCart = (sku: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.sku !== sku));
    setQuantities((prevQuantities) => {
      const { [sku]: _, ...remainingQuantities } = prevQuantities; // Remove the quantity for the removed item
      return remainingQuantities;
    });
    notification.warning({
      message: 'Item Removed',
      description: 'The item has been removed from your cart.',
      duration: 2,
    });
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku); // If the quantity is set to 0 or less, remove the item from the cart
      return;
    }

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [sku]: quantity,
    }));

    notification.info({
      message: 'Quantity Updated',
      description: `Quantity for item has been updated to ${quantity}.`,
      duration: 2,
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setQuantities({});
    localStorage.removeItem("cartItems");
    localStorage.removeItem("quantities");

    notification.warning({
      message: 'Cart Cleared',
      description: 'All items have been removed from your cart.',
      duration: 2,
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, quantities, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
