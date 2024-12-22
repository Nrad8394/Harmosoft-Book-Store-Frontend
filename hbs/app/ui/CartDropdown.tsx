import React from 'react';
import Link from 'next/link';
import SelectedItemCard from './SelectedItemCard'; // Import SelectedItemCard
import { RiDeleteBin6Line } from 'react-icons/ri';

interface CartDropdownProps {
  selectedItems: any[];
  quantities: { [key: string]: number };
  totalPrice: number;
  handleCheckout: () => void;
  handleQuantityChange: (sku: string, newQuantity: number) => void;
  handleRemoveBook: (sku: string) => void;
  setModalBook: (book: any) => void;
  clearCart: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({
  selectedItems,
  quantities,
  totalPrice,
  handleCheckout,
  handleQuantityChange,
  handleRemoveBook,
  setModalBook,
  clearCart,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-20">
      <div className="p-4">
        {/* View Cart and Checkout Buttons */}
        <div className="mt-4 flex justify-between space-x-4">
          <Link href="/cart" className='w-full'>
            <button className="w-full bg-green-600 text-white px-4 py-2 text-center rounded-md hover:bg-green-700">
              View Cart
            </button>
          </Link>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white px-4 py-2 text-center rounded-md hover:bg-green-700"
          >
            Checkout
          </button>
        </div>

        {/* Empty Cart State */}
        {selectedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p>Your cart is empty</p>
            <p className="text-sm">Add some items to get started!</p>
          </div>
        ) : (
          // Cart Items List
          <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-2">
            {selectedItems.map((book) => (
              <div key={book.sku} className="flex items-center space-x-4">
                <SelectedItemCard
                  image={book.image}
                  title={book.name}
                  price={parseFloat(book.price)}
                  quantity={quantities[book.sku]}
                  onQuantityChange={(newQuantity) => handleQuantityChange(book.sku, newQuantity)}
                  onRemove={() => handleRemoveBook(book.sku)}
                  onClick={() => setModalBook(book)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Cart Footer: Clear Cart and Total Price */}
        <div className="mt-4 flex justify-between items-center text-lg font-semibold">
          <button
            onClick={() => {
              clearCart();
            }}
            type="button"
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 flex items-center space-x-1"
          >
            <RiDeleteBin6Line />
            <span>Clear Cart</span>
          </button>
          <p className="text-gray-700">
            Total: <span className="font-bold">Ksh. {totalPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
