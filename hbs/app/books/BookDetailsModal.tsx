import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import { IoClose } from "react-icons/io5"; // Import an icon for the close button

interface BookDetailsModalProps {
  book: any;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: (sku: string) => void;
  recommendedBooks: any[];
  substitutes: any[];
  onReplace: (substitute: any,book :any) => void;
  onAddToList: (book: any, quantity: number) => void;
  quantity: number;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedItems: any[];
}

export default function BookDetailsModal({
  book,
  isSelected,
  onClose,
  onToggleSelect,
  recommendedBooks,
  substitutes,
  onReplace,
  onAddToList,
  quantity,
  handleQuantityChange,
  selectedItems,
}: BookDetailsModalProps) {

  if (!book) return null;

  const isBookInList = (sku: string) => selectedItems.some(item => item.sku === sku);

  return (
    <Modal
      isOpen={!!book}
      onRequestClose={onClose}
      contentLabel="Book Details"
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto pt-3 z-20"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 space-y-4 h-auto relative">
        {/* Close Button in the Top Right Corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-600 hover:text-green-800"
        >
          <IoClose size={24} /> {/* Icon for close (X) */}
        </button>

        <p className="text-2xl font-bold">{book?.name || "No Title Available"}</p>
        <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
          <div className="relative w-full h-64 md:w-1/3 md:h-auto">
            <Image
              src={book?.image || "/default-book.jpg"}
              alt={book?.name || "Book image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          <div className="flex-1">
            <p className="mb-1 text-black"><strong>Category:</strong> {book?.category || "Unknown"}</p>
            <p className="mb-1 text-black"><strong>Publisher:</strong> {book?.publisher || "Unknown"}</p>
            <p className="mb-1 text-black"><strong>Rating:</strong> {book?.rating || "N/A"}</p>
            <p className="mb-1 text-black"><strong>Paper Quality:</strong> {book?.paperQuality || "Standard"}</p>
            <p className="mb-1 text-black"><strong>Price:</strong> Ksh. {book?.price || "0"}</p>
            <p className="mb-1 text-black">
              <strong>Quantity:</strong>
              <input
                placeholder="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded-md p-1 ml-2 w-16"
                min="1"
              />
            </p>
            <div className="flex flex-row justify-around mt-4">
              <button
                className={`max-w-xs px-4 py-2 text-white ${isSelected ? "bg-red-600" : "bg-green-600"} rounded-md transition-all duration-500`}
                onClick={() => onToggleSelect(book)}
              >
                {isSelected ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {book?.substitutable && substitutes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Substitutable Options</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {substitutes.map((substitute) => {
                  const isInList = isBookInList(substitute.sku);
                  return (
                    <div key={substitute.sku} className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-2">
                        <Image
                          src={substitute.image}
                          alt={substitute.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <p className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-44">{substitute.name}</p>
                      <p className="text-sm bg-black">Ksh. {substitute.price}</p>
                      <button
                        className={`w-full px-2 py-1 text-white rounded-md transition-all duration-500 mt-2 ${isInList ? "bg-red-600" : "bg-blue-600"}`}
                        onClick={() => isInList ? onToggleSelect(substitute) : onReplace(substitute , book)}
                      >
                        {isInList ? "Remove from List" : "Replace"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!book?.substitutable && recommendedBooks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Recommended Additional Books</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedBooks.map((recommendedBook) => {
                  const isInList = isBookInList(recommendedBook.sku);
                  return (
                    <div key={recommendedBook.sku} className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-2">
                        <Image
                          src={recommendedBook.image}
                          alt={recommendedBook.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <p className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-44">{recommendedBook.name}</p>
                      <p className="text-sm text-black">Ksh. {recommendedBook.price}</p>
                      <button
                        className={`w-full px-2 py-1 text-white rounded-md transition-all duration-500 mt-2 ${isInList ? "bg-red-600" : "bg-green-600"}`}
                        onClick={() => isInList ? onToggleSelect(recommendedBook) : onAddToList(recommendedBook, 1)}
                      >
                        {isInList ? "Remove from Cart" : "Add to Cart"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
