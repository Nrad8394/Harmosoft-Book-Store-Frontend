"use client";

import React, { useState, useEffect } from "react";
import FullWidthSearchBar from "../ui/SearchBarFull";
import CategoryHeader from "../ui/CatHeader";
import Card from "../ui/card";
import BookDetailsModal from "./BookDetailsModal"; 
import SelectedItemCard from "../ui/SelectedItemCard";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";  // Import the shopping cart icon
import { useItems } from "../context/itemContext";
import { useCart } from "../context/CartContext";
interface Book {
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

export default function BookStore() {
  const [selectedItems, setSelectedItems] = useState<Book[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [statuses, setStatuses] = useState<{ [key: string]: boolean }>({});
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading books...");
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);  // State for floating button
  const { 
    filteredItems, 
    loading, 
    currentPage, 
    totalPages, 
    setPage, 
    setFilter,
    filters, 
    clearFilters, 
    handleSearchChange, 
    removeFilter, 
    autoSuggestions, 
    handleSuggestionClick, 
    searchTerm 
  } = useItems();
 const { cartItems,addToCart,removeFromCart } =  useCart();


  const router = useRouter();

  useEffect(() => {
    const storedSelectedBooks = JSON.parse(sessionStorage.getItem("selectedBooks") || "[]");
    const storedQuantities = JSON.parse(sessionStorage.getItem("quantities") || "{}");
    const storedStatuses = JSON.parse(sessionStorage.getItem("statuses") || "{}");
    
    if (Array.isArray(storedSelectedBooks) && storedSelectedBooks.length > 0) {
      setSelectedItems(storedSelectedBooks);
    } 
    if (typeof storedQuantities === "object") {
      setQuantities(storedQuantities);
    }
    if (typeof storedStatuses === "object") {
      setStatuses(storedStatuses);
    }
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const newTotalPrice = selectedItems.reduce((acc, book) => {
        const quantity = quantities[book.sku] || 1;
        return acc + parseFloat(book.price) * quantity;
      }, 0);
      setTotalPrice(newTotalPrice);
    };

    calculateTotalPrice();
  }, [selectedItems, quantities]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingButton(true);
      } else {
        setShowFloatingButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleAddToList = (book: Book, quantity: number) => {
    cartItems.some((item) => item.sku === book.sku)
      ? removeFromCart(book.sku)
      : addToCart(book, quantity);
  
      return cartItems;
  };
  const handleReplace = (substitute: Book) => {
    if (modalBook) {  // Ensure modalBook is not null
      removeFromCart(modalBook.sku)
      addToCart(substitute,1)
      // Update the modalBook to the substitute
      setModalBook(substitute);
    }
  };
  
  


  const handleCategoryClick = (category: string) => {
    setFilter("category", category); // This ensures the filter is applied in the context.
  };




  const recommendedBooks = (book: Book) => {
    return filteredItems
      .filter(
        (b) =>
          b.sku !== book.sku && // Exclude the current book
          b.name !== book.name && // Exclude the current book
          b.category === book.category && // Match the same category
          // b.subject === book.subject && // Match the same subject
          b.curriculum === book.curriculum && // Match the same curriculum
          b.grade === book.grade // Match the same grade
      )
      // Uncomment the following line if you have a rating field and want to sort by it
      // .sort((a, b) => b.rating - a.rating) // Sort by rating
      .slice(0, 4); // Get the top 4 books
  };
  
  const substitutes = (book: Book) => {
    return filteredItems
      .filter(
        (b) =>
          b.sku !== book.sku && // Exclude the current book
          b.name !== book.name && // Exclude the current book
          b.category === book.category && // Match the same category
          // b.subject === book.subject && // Match the same subject
          b.curriculum === book.curriculum && // Match the same curriculum
          b.grade === book.grade // Match the same grade
      )
      // Uncomment the following line if you have a rating field and want to sort by it
      // .sort((a, b) => b.rating - a.rating) // Sort by rating
      .slice(0, 4); // Get the top 4 books
  };
  
  const toggleSelectedItem = (book: Book) => {
    cartItems.some((item) => item.sku === book.sku)
      ? removeFromCart(book.sku)
      : addToCart(book, 1);
  };
  
  const handleQuantityChange = (sku: string, quantity: number) => {
    if (quantity === 0) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.sku !== sku)
      );
      setQuantities((prevQuantities) => {
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[sku];
        return updatedQuantities;
      });
    } else {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [sku]: quantity,
      }));
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setActiveScreen("list")
  
    // Delay to ensure UI update
    setTimeout(async () => {
      try {
        await sessionStorage.setItem("selectedBooks", JSON.stringify(selectedItems));
        await sessionStorage.setItem("quantities", JSON.stringify(quantities));
        await sessionStorage.setItem("statuses", JSON.stringify(statuses));
        router.push("/list");
      } catch (error) {
        console.error("Error during checkout:", error);
      } finally {
        setIsCheckingOut(false);  // Ensure this is reset in case of an error
      }
    }, 1000); // Delay the navigation to ensure UI updates
  };
  const renderPaginationControls = () => {
    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    );
  };
  
  const renderBooks = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-green-700 rounded-lg shadow-md flex items-end space-x-4">
            <div className="bg-white flex items-center h-full p-3 ml-10 space-x-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-transparent border-solid border-8 border-green-700"></div>
              <p className="text-lg font-semibold text-green-700">{loadingMessage}</p>
            </div>
          </div>
        </div>
      );
    }
  
    if (filteredItems.length === 0) {
      return <p className="text-center text-gray-500">No books found</p>;
    }
  
    return (
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mt-4">
        {filteredItems.map((book) => (
          <div
            key={book.sku}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full"
            onClick={() => setModalBook(book)}
          >
            <Card
              image={book.image}
              title={book.name}
              description={`Ksh. ${book.price}`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelectedItem(book);
              }}
              className={`w-full px-4 py-2 text-white text-center flex justify-center items-center ${
                cartItems.some((item) => item.sku === book.sku) ? "bg-red-600" : "bg-green-600"
              } rounded-b-md transition-all duration-500 mt-auto`}
            >
              {cartItems.some((item) => item.sku === book.sku)
                ? "Remove from Cart"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </section>
    );
  };
  
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState("details");

  // Check if the screen is small (e.g., below 768px)
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <main className="flex flex-col min-h-screen w-full p-4">
      {!modalBook && (
        <>
          <div
            className={`${
              isSmallScreen && scrollDirection === "down" ? "sticky top-0 z-10" : "relative"
            } transition-all duration-300 ease-in-out`}
          >
             <FullWidthSearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                 activeCategory={filteredItems.length > 0 ? filteredItems[0].category : ""}
                onClearFilter={clearFilters}
                removeFilter={removeFilter}
                suggestions={autoSuggestions}
                onSuggestionClick={handleSuggestionClick}
                activeFilters={{
                  books: filters.books || "",
                  study_level: filters.study_level || "",
                  curriculum: filters.curriculum || "",
                  grade: filters.grade || "",
                }}
              />
          </div>

          <div
            className={`${
              isSmallScreen && scrollDirection === "up" ? "sticky top-0 z-10" : " "
            } transition-all duration-300 ease-in-out`}
          >
            <CategoryHeader
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </>
      )}

      <div className="flex flex-col lg:flex-row min-h-screen w-full p-4">
        {/* <aside className="bg-white p-4 rounded-lg shadow-md h-auto lg:mr-8 mb-4 lg:mb-0 lg:sticky top-4">
          <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4">
              Your Order ({selectedItems.length})
          </h2>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden text-green-600 hover:text-green-800 focus:outline-none"
            >
              {isCollapsed ? "Show All" : "Hide Details"}
            </button>
          </div>

          <div className={`${isCollapsed ? "hidden" : "block"} lg:block mb-4`}>
            {selectedItems.length === 0 ? (
              <p>No items selected</p>
            ) : (
              <div className="space-y-4 max-h-screen overflow-y-auto">
                {selectedItems.map((book) => (
                  <SelectedItemCard
                    key={book.sku}
                    image={book.image}
                    title={book.name}
                    price={parseFloat(book.price)}
                    quantity={quantities[book.sku]}
                    onQuantityChange={(newQuantity) => handleQuantityChange(book.sku, newQuantity)}
                    onRemove={() => toggleSelectedItem(book)}
                    onClick={() => setModalBook(book)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-lg font-semibold mb-4">Total: Ksh. {totalPrice.toFixed(2)}</div>
              <button
                className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-all duration-500 flex items-center justify-center ${
                  selectedItems.length > 0 && !isCheckingOut
                    ? "bg-green-600 hover:bg-green-700"
                    : isCheckingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={selectedItems.length === 0 || isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "CheckOut"
                )}
              </button>
          </div>
        </aside> */}

        <div className="flex-grow container m-auto">
          <div className="flex flex-row justify-between mt-4 w-full">
            {/* <div className="flex bg-gray-200 rounded-xl overflow-hidden shadow-md">
              <button
                onClick={handleCheckout}
                className={`px-3 py-2 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  activeScreen === "list"
                    ? "bg-green-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Order List
              </button>
              <button
                onClick={() => setActiveScreen("details")}
                className={`px-3 py-2 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  activeScreen === "details"
                    ? "bg-green-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Order Details
              </button>
            </div> */}
            <p className="font-bold text-black text-xl">
                All Books & Stationary
            </p>
          </div>

          <hr className="h-0.5 mt-2 bg-black rounded-full mx-auto" />

          <div className="flex-grow container m-auto min-h-screen">
            {renderBooks()}
            {renderPaginationControls()}
          </div>

          {modalBook && (
            <BookDetailsModal
              book={modalBook}
              isSelected={cartItems.some((item) => item.sku === modalBook.sku)}
              onClose={() => setModalBook(null)}
              onToggleSelect={(book:any) => toggleSelectedItem(book)}
              recommendedBooks={recommendedBooks(modalBook)}
              substitutes={substitutes(modalBook)}
              quantity={quantities[modalBook.sku] || 1}
              handleQuantityChange={(e) => handleQuantityChange(modalBook.sku, parseInt(e.target.value, 10))}
              onReplace={handleReplace}
              onAddToList={(book, quantity) => handleAddToList(book, quantity)}
              selectedItems={cartItems}
            />
          )}
        </div>
      </div>

      {/* Floating Checkout Button */}
        {/* {showFloatingButton && selectedItems.length > 0 && (
          <button
            onClick={handleCheckout}
            className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 z-50"
          >
            <div className="relative">
              <FaShoppingCart className="text-lg" />
              {selectedItems.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {selectedItems.length}
                </span>
              )}
            </div>
            <span>Checkout</span>
          </button>
        )} */}


    </main>
  );
}
