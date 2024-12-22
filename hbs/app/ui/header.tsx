"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './logo';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import CartDropdown from './CartDropdown';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems, quantities, updateQuantity, clearCart, removeFromCart } = useCart(); // Using CartContext to get cart items and quantities
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false); // For cart dropdown
  const [showDropdown, setShowDropdown] = useState(false); // For account dropdown
  const [modalBook, setModalBook] = useState(null);
  const pathname = usePathname();

  // Refs for the dropdowns
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define navigation links
  const links = [
    { href: '/', label: 'Home' },
    { href: '/books', label: 'Books' },
    { href: '/listedSchools', label: 'Schools' },
  ];

  // Calculate total price based on cart items and quantities
  const totalPrice = cartItems.reduce((total, book) => {
    const quantity = quantities[book.sku] || 1; // Use quantity from quantities object
    return total + (parseFloat(book.price) * quantity);
  }, 0);

  // Calculate selected items count
  const selectedItemsCount = cartItems.length;

  // Handle cart dropdown toggle
  const toggleCartDropdown = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen);
  };

  // Handle account dropdown toggle
  const toggleAccountDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle checkout action
  const handleCheckout = () => {
    console.log("Checking out...");
  };

  // Check if the current pathname matches any of the links
  const isAnyLinkActive = links.some(link => link.href === pathname || link.href === "/cart");

  return (
    <>
      <header className="max-w-full bg-white shadow-md w-full m-0">
        <div className="w-full flex flex-col md:flex-row justify-around items-center">
          {/* Logo */}
          <div className="relative w-full flex items-center bg-green-600">
            <div className="flex-grow flex items-center justify-center px-4">
              <Logo />
            </div>
            <div className="w-0 h-0 border-r-[40px] border-t-[60px] border-t-transparent border-r-white"></div>
          </div>

          {/* Navigation Links */}
          <nav className="relative w-full mt-4 md:mt-0 flex justify-center md:justify-end items-center px-2">
            <div className="flex justify-around space-x-3 w-full">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-semibold text-sm sm:text-base md:text-lg lg:text-2xl text-green-600 hover:text-gray-700 transition-all duration-1000 ${
                    (link.href === '/' && !isAnyLinkActive) || pathname === link.href ? 'underline' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="font-semibold text-sm sm:text-base md:text-lg lg:text-2xl text-green-600 hover:text-gray-700 flex items-center"
                >
                  <FaRegUserCircle className="mr-2" />
                  Login
                </button>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={toggleAccountDropdown}
                    className={`font-semibold text-sm sm:text-base md:text-lg lg:text-2xl text-green-600 hover:text-gray-700 flex items-center ${pathname === '/account' ? 'underline' : ''}`}
                  >
                    <FaRegUserCircle className="text-base lg:text-2xl mr-2" />
                    <span className="block max-w-[120px] md:max-w-[200px] lg:max-w-[250px] truncate" title={user.username}>
                      {user.username}
                    </span>
                  </button>

                  {/* Account Dropdown */}
                  {showDropdown && (
                    <div ref={accountDropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20">
                      <Link href="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        My Account
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Cart Icon with Dropdown */}
              <div className="relative" ref={cartDropdownRef}>
                <button onClick={toggleCartDropdown} className="flex items-center p-2">
                  <FaShoppingCart className="text-lg" />
                  {selectedItemsCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {selectedItemsCount}
                    </span>
                  )}
                </button>
                {isCartDropdownOpen && (
                  <CartDropdown
                    selectedItems={cartItems} // Pass selected items directly from cart context
                    quantities={quantities}
                    totalPrice={totalPrice}
                    handleCheckout={handleCheckout}
                    handleQuantityChange={updateQuantity}
                    handleRemoveBook={removeFromCart}
                    setModalBook ={(book) => setModalBook(book)}
                    clearCart = {clearCart}
                  />
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {showAuthModal && <AuthModal closeModal={() => setShowAuthModal(false)} />}
    </>
  );
}
