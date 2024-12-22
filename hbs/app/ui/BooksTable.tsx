import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Import an icon for the close button
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import Modal from "react-modal";
interface Book {
  sku: string;
  category: string;
  name: string;
  subject: string;
  publisher: string;
  price: number;
  image: string;
  rating: number;
  paperQuality: string;
}

interface BooksTableProps {
  books: Book[];
  quantities: { [key: string]: number };
  statuses: { [key: string]: boolean };
  handleStatusChange: (sku: string) => void;
  handleQuantityChange: (sku: string, quantity: number) => void;
}

export default function ResponsiveBooksTable({
  books,
  quantities,
  statuses,
  handleStatusChange,
  handleQuantityChange,
}: BooksTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Media queries for responsiveness
  const isSmallScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 768px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const totalPrice = books && statuses && quantities
    ? books
        .filter((book) => statuses[book.sku]) // Ensure status exists for this book
        .reduce((sum, book) => sum + (quantities[book.sku] || 0) * book.price, 0)
    : 0;

  const selectedItemsCount = books && statuses
    ? books.filter((book) => statuses[book.sku]).length
    : 0;

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="mx-auto my-4 text-black w-full">
      <div className="max-w-full w-full overflow-x-auto ">
        <Table className="min-w-full bg-white rounded-lg shadow-md">
          <Thead className="bg-green-700 text-white">
            <Tr>
              {isMediumScreen && (
                <Th className="px-4 py-2 text-left font-medium">
                  <div className="flex items-center">
                    <FaShoppingCart className="text-lg" />
                    {selectedItemsCount > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {selectedItemsCount}
                      </span>
                    )}
                  </div>
                </Th>
              )}
              <Th className="px-4 py-2 text-left font-medium">Quantity</Th>
              {isLargeScreen && <Th className="hidden lg:table-cell px-4 py-2 text-left font-medium">Category</Th>}
              <Th className="px-4 py-2 text-left font-medium">Title</Th>
              {isSmallScreen && <Th className="hidden sm:table-cell px-4 py-2 text-left font-medium">Subject</Th>}
              {isLargeScreen && <Th className="hidden md:table-cell px-4 py-2 text-left font-medium">Publisher</Th>}
              {isMediumScreen && <Th className="hidden md:table-cell px-4 py-2 text-left font-medium">Product ID</Th>}
              <Th className="px-4 py-2 text-left font-medium">Price/Unit (Ksh)</Th>
              <Th className="px-4 py-2 text-left font-medium">Total Price (Ksh)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {books.map((book) => (
              <Tr key={book.sku} className="border-t">
                <Td className="px-2 sm:px-4 py-2 border-r">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={statuses[book.sku]}
                      onChange={() => handleStatusChange(book.sku)}
                    />
                    <div className="w-8 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                    <span className="ml-3 text-xs sm:text-sm font-medium text-gray-900">
                      {statuses[book.sku] ? "Added" : "Removed"}
                    </span>
                  </label>
                </Td>
                <Td className="px-2 sm:px-4 py-2 border-r">
                  <input
                    placeholder="quantity"
                    type="number"
                    value={quantities[book.sku] || 0}
                    min="0"
                    onChange={(e) => handleQuantityChange(book.sku, Number(e.target.value))}
                    className="w-full p-1 text-center border rounded-md text-xs sm:text-sm"
                  />
                </Td>
                {isLargeScreen && <Td className="hidden lg:table-cell px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">{book.category}</Td>}
                <Td className="px-2 sm:px-4 py-2 border-r">
                  <span
                    onClick={() => openModal(book)}
                    className="cursor-pointer hover:underline text-xs sm:text-sm"
                  >
                    {book.name}
                  </span>
                </Td>
                {isSmallScreen && <Td className="hidden sm:table-cell px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">{book.subject}</Td>}
                {isLargeScreen && <Td className="hidden lg:table-cell px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">{book.publisher}</Td>}
                {isMediumScreen && <Td className="hidden md:table-cell px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">{book.sku}</Td>}
                <Td className="px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">
                  {book.price}
                </Td>
                <Td className="px-2 sm:px-4 py-2 border-r text-xs sm:text-sm">
                {statuses[book.sku] ? (quantities[book.sku] * book.price).toFixed(2) : (0).toFixed(2)}
                </Td>
              </Tr>
            ))}
            {/* <Tr className="border-t font-bold">
              <Td className="hidden md:table-cell px-4 py-2 text-xs sm:text-sm" colSpan={7}>
                Total Price
              </Td>
              <Td className="px-4 py-2 text-xs sm:text-sm">KSH {totalPrice}</Td>
            </Tr> */}
          </Tbody>
        </Table>
      </div>

     {/* Modal */}
        {modalOpen && selectedBook && (
          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            contentLabel="Book Details"
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto pt-3 z-20"
          >
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 space-y-4 h-auto">
              
                {/* Close Button in the Top Right Corner */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-green-600 hover:text-green-800"
                >
                  <IoClose size={24} /> {/* Icon for close (X) */}
                </button>
              <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                <div className="relative w-full h-64 md:w-1/3 md:h-auto">
                  <Image
                    src={selectedBook?.image || "/default-book.jpg"}
                    alt={selectedBook?.name || "Book image"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{selectedBook?.name || "No Title Available"}</h2>
                  <p className="mb-1"><strong>Category:</strong> {selectedBook?.category || "Unknown"}</p>
                  <p className="mb-1"><strong>Publisher:</strong> {selectedBook?.publisher || "Unknown"}</p>
                  <p className="mb-1"><strong>Rating:</strong> {selectedBook?.rating || "N/A"}</p>
                  <p className="mb-1"><strong>Paper Quality:</strong> {selectedBook?.paperQuality || "Standard"}</p>
                  <p className="mb-1"><strong>Price:</strong> Ksh. {selectedBook?.price || "0"}</p>
                  <p className="mb-1">
                    <strong>Quantity:</strong>
                    <input
                      placeholder="quantity"
                      type="number"
                      value={quantities[selectedBook.sku]}
                      onChange={(e) => handleQuantityChange(selectedBook.sku, Number(e.target.value))}
                      className="border border-gray-300 rounded-md p-1 ml-2 w-16"
                      min="1"
                    />
                  </p>
                  <div className="flex flex-row justify-around mt-4">
                    <button
                      className={`max-w-xs px-4 py-2 text-white ${statuses[selectedBook.sku] ? "bg-red-600" : "bg-green-600"} rounded-md transition-all duration-500`}
                      onClick={() => handleStatusChange(selectedBook.sku)}
                    >
                      {statuses[selectedBook.sku] ? "Remove from List" : "Add to List"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

    </div>
  );
}
