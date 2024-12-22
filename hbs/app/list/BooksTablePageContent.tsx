"use client";
import React,{ Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../ui/searchbar";
import Table from "../ui/BooksTable";
import { FiRefreshCw } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { AiOutlineCheckCircle,AiOutlineCloseCircle  } from "react-icons/ai";
import { getCollection,createOrder,createMpesa,getOrganizationsSummary } from "@/handler/Api";
import { useSearchParams } from "next/navigation";
import { AiFillWarning } from "react-icons/ai"; 
import { FaThumbsUp } from "react-icons/fa6";
import ConfidenceCard from "../ui/ConfidenceCard";
import { message } from "antd";
import Pusher from "pusher-js"; // Import Pusher
import { handlePackSelection } from "@/handler/Api";
import { useCart } from "../context/CartContext";
interface Book {
  sku: string;
  name: string;
  ISBN: string;
  description: string;
  price: number;
  visibility: boolean;
  stock_availability: boolean;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
  study_level: string;
  curriculum: string;
  cluster: string;
  tag: string;
  discount: string;
  discounted_price: string;
}

interface BookEntry {
  item: Book;
  quantity: number;
}
interface Order {
  id: string;
  items: any[]; // Adjust this to the proper structure if you know the item type
  date: string;
  payment_status: string;
  total: string;
}
interface MpesaPaymentDetail {
  amount: string;
  created_at: string;
  id: string;
  order: Order;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  updated_at: string;
  user: any; // or `null` if it's always null
}
export default function BooksTablePageContent() {
  const [books, setBooks] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [collectionId, setcollectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mpesaPhoneNumber, setmpesaPhoneNumber] = useState("");
  const [childName, setChildName] = useState("");
  const [schoolCampus, setSchoolCampus] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [grade, setGrade] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [activeScreen, setActiveScreen] = useState("list");
  const [loadingMessage, setLoadingMessage] = useState("please wait");
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State to track payment success
  const searchParams = useSearchParams(); // Client-side hook
  const router = useRouter();
  const { addToCart } = useCart(); // Destructure addToCart from the context
  const [selectedPack, setSelectedPack] = useState("Economy Pack"); // Set default to "Economy Pack"
  const [mpesaPaymentDetails, setMpesaPaymentDetails] = useState<MpesaPaymentDetail | null>(null);
  useEffect(() => {
    // Only run on the client
    if (typeof window !== "undefined") {
      const collection = searchParams.get("collectionId") || ""; // Get collection from search params
      setcollectionId(collection); // Set collectionId in state for future use
  
      if (collection) {
        const fetchCollectionItems = async () => {
          setLoading(true);
          try {
            const data = await getCollection(collection); // Fetch collection items
            if (data && data.items) {
              // Map over the items and extract 'item' and 'quantity'
              const booksData = data.items.map((entry: any) => ({
                ...entry.item,
                quantity: entry.quantity || 1, // Include the quantity in each item
              }));
  
              // Initialize statuses and quantities with the right keys
              const initialStatuses: { [key: string]: boolean } = {};
              const initialQuantities: { [key: string]: number } = {};
  
              booksData.forEach((book: any) => {
                initialStatuses[book.sku] = true; // Set all books as selected by default
                initialQuantities[book.sku] = book.quantity; // Set the actual quantity
              });
  
              // Update the state
              setBooks(booksData);
              setStatuses(initialStatuses);
              setQuantities(initialQuantities);
            }
          } catch (error) {
            console.error("Error fetching collection:", error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchCollectionItems(); // Fetch collection items with the correct collection id
      }
    }
  }, [searchParams]); // Only trigger when searchParams change
  useEffect(() => {
    // Scroll to the top when the loading is finished
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]); // The effect will trigger when the loading state changes
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const campuses = await getOrganizationsSummary();
        setSchoolCampus(campuses); // Fetching the school campuses from the API
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    // Retrieve the data from sessionStorage
    const selectedBooks = JSON.parse(sessionStorage.getItem("selectedBooks") || "[]");
    const storedQuantities = JSON.parse(sessionStorage.getItem("quantities") || "{}");
    const storedStatuses = JSON.parse(sessionStorage.getItem("statuses") || "{}");
  
    // Check if the data is valid and not null before setting it in the state
    if (Array.isArray(selectedBooks) && selectedBooks.length > 0) {
      setBooks(selectedBooks);
    } 
    if (storedQuantities && typeof storedQuantities === "object") {
      setQuantities(storedQuantities);
    }
  
    if (storedStatuses && typeof storedStatuses === "object") {
      setStatuses(storedStatuses);
    }
  
    console.log(selectedBooks);
  }, []);
  
  const handlePackSelectionInComponent = async (packName: string) => {
    setSelectedPack(packName)
    try {
      const response = await handlePackSelection(packName, collectionId);
  
      if (response && response.items) {
        // Process the returned items to update books and separate quantities
        const updatedBooks: Book[] = response.items.map((entry: BookEntry) => ({
          ...entry.item, // Extract just the book data, without quantity
        }));
  
        const updatedStatuses: { [key: string]: boolean } = {};
        const updatedQuantities: { [key: string]: number } = {};
  
        // Separate handling of statuses and quantities
        response.items.forEach((entry: BookEntry) => {
          updatedStatuses[entry.item.sku] = true; // Set all books as selected by default
          updatedQuantities[entry.item.sku] = entry.quantity || 1; // Use the separate quantity from the response
        });
  
        // Update the state with the new data
        setBooks(updatedBooks); // Only book data, without quantity
        setStatuses(updatedStatuses); // Status for selection
        setQuantities(updatedQuantities); // Separate quantities for each book
  
        message.success("Pack applied successfully.");
      } else {
        message.error("Failed to apply the selected pack.");
      }
    } catch (error) {
      console.error("Error selecting pack:", error);
      message.error("An error occurred while applying the pack. Please try again.");
    }
  };
  
  
  const handleStatusChange = (sku: string) => {
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [sku]: !prevStatuses[sku],
    }));
  };

  const handleQuantityChange = (sku: string, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [sku]: quantity,
    }));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
  };
  
  const handlePayNow = async () => {
    setLoadingMessage("Processing Payments ...");
  
    // Validate common fields
    if (!email || !childName || !deliveryMethod) {
      message.error("Please fill in the email, recipient name, and select a delivery method.");
      return;
    }
  
    // Validate school-related fields if delivery method is school
    if (deliveryMethod === "school") {
      if (!schoolId) {
        message.error("Please select a valid school from the suggestions.");
        return;
      }
  
      if (!grade) {
        message.error("Please select a valid grade.");
        return;
      }
    }
  
    // Validate home-related fields if delivery method is home
    if (deliveryMethod === "home") {
      if (!deliveryLocation || !phoneNumber) {
        message.error("Please fill in the delivery location and phone number.");
        return;
      }
    }
  
    // Prepare the data for the order based on the delivery method
    const selectedBooks = books.filter((book) => statuses[book.sku]);
    const orderItems = selectedBooks.map((book) => ({
      item_id: book.sku,
      quantity: quantities[book.sku],
    }));
  
    let orderData = {};
  
    if (deliveryMethod === "school") {
      orderData = {
        items: orderItems,
        receipient_name: childName,
        organization: schoolId, // Ensure a valid school ID is sent
        receipt_email: email,
        grade: grade, // Ensure a valid grade is sent
      };
    } else if (deliveryMethod === "home") {
      orderData = {
        items: orderItems,
        receipient_name: childName,
        receipt_email: email,
        delivery_location: deliveryLocation,
        phone_number: phoneNumber,
      };
    }
  
    console.log("Order Data:", orderData); // Logging the order data
  
    setLoading(true);
  
    try {
      // Send the order data to the backend
      const orderResponse = await createOrder(orderData);
      console.log("Order created:", orderResponse);
  
      const paymentDetails = {
        orderId: orderResponse.id,
        phone_number: phoneNumber,
      };
  
      const createMpesaPayment = await createMpesa(paymentDetails);
      // console.log("Payment created:", createMpesaPayment.payment_details);
      await setMpesaPaymentDetails(createMpesaPayment.payment_details)
      console.log("setMpesaPaymentDetails created:", mpesaPaymentDetails);

      // Set up Pusher to listen for payment status
      const pusher = new Pusher("f238dc2ebfb0118cdc08", {
        cluster: "mt1", // replace with your cluster
        // encrypted: true,
      });
  
      const channel = pusher.subscribe(`order-${orderResponse.id}`); // Use the order ID as the channel
  
      channel.bind("transaction-status", function (data:any) {
        console.log("Received data from Pusher:", data);
  
        if (data.status === "success") {
          setLoading(false);
          setPaymentSuccess(true);
          setShowModal(true);
        } else if (data.status === "failure") {
          setPaymentSuccess(false);
          setLoading(false);
          setShowModal(true);
        }
      });
  
      channel.bind("pusher:subscription_error", function (statusCode:any) {
        console.error("Pusher subscription error:", statusCode);
        setLoading(false);
        alert("An error occurred. Please try again.");
      });
  
      setTimeout(() => {
        setLoading(false);
        setPaymentSuccess(false);
        setShowModal(true);
      }, 60000);
    } catch (error:any) {
      console.error("Error creating order:", error);
      setLoading(false);
      setPaymentSuccess(false);
      setShowModal(true);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert("An error occurred while processing your order. Please try again.");
      }
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const calculateTotal = () => {
    const totalBeforeDiscount = books.reduce((sum, book) => sum + book.price * quantities[book.sku], 0);
    const discount = Math.round(totalBeforeDiscount * 0.04); // Rounded to the nearest whole number
    const totalAfterDiscount = totalBeforeDiscount - discount;
    const packagingAndDelivery = 350;
    const grandTotal = totalAfterDiscount + packagingAndDelivery;
    
    return {
      totalBeforeDiscount,
      discount,
      totalAfterDiscount,
      packagingAndDelivery,
      grandTotal
    };
  };
  const totals = calculateTotal();
  const hasRemovedSchoolItem = Object.values(statuses).some(status => !status);
  const handleViewDetails = async () => {
    // Store selected books and quantities in sessionStorage
    await sessionStorage.setItem("selectedBooks", JSON.stringify(books));
    await sessionStorage.setItem("quantities", JSON.stringify(quantities));
    await sessionStorage.setItem("statuses", JSON.stringify(statuses));

    // Redirect to the BooksTablePage
    router.push("/cart");
  };
  const handleAddToCart = () => {
  
    // Loop through the selected books and add each to the cart
    books.forEach((book) => {
      const quantity = quantities[book.sku] || 1; // Get the quantity or default to 1
      addToCart(book, quantity); // Use addToCart function from context
    });
  };
  return (
    <main className="flex flex-col min-h-screen w-full md:px-4">
      <Suspense fallback={<p>Loading...</p>}>
      <div className="relative flex flex-col items-center mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-green-700 rounded-lg shadow-md flex items-end space-x-4">
              <div className="bg-white flex items-center h-full p-3 ml-10 space-x-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-transparent border-solid border-8 border-green-700"></div>
                <p className="text-lg font-semibold text-green-700">
                  {loadingMessage}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col items-center">
            <p className="text-xl font-bold text-center mx-auto mt-4 mb-4">
              Get kids&apos; books online, delivered to your doorstep or your kids&apos; schools.
            </p>

              <p className="text-red-700 font-bold text-center mx-auto mb-2">
                Order before 20th December and get up to 10% off
              </p>
              
              <SearchBar />
              <div className="max-w-full w-full flex flex-row md:flex-row justify-between items-start md:items-center mt-4 space-y-4 md:space-y-0">
                  {/* Button Group and Order ID */}
                  <div className="max-w-full w-full flex flex-row sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="flex bg-gray-200 rounded-xl overflow-hidden shadow-md">
                      <button
                        onClick={() => setActiveScreen("list")}
                        className={`px-3 py-2 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          activeScreen === "list"
                            ? "bg-green-700 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Order List
                      </button>
                      <button
                        onClick={handleViewDetails}
                        className={`px-3 py-2 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          activeScreen === "details"
                            ? "bg-green-700 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        View Cart
                      </button>
                      
                      
                    </div>
                    {/* <p className="hidden md:block text-sm md:text-base font-semibold text-gray-700 mx-4 text-center sm:text-left">
                      Order Id: <span>{collectionId}</span>
                    </p> */}
                    <div className=" flex flex-row gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="px-3 py-2 bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center justify-center"
                          >
                            <BiPlus className="text-white mr-2" />
                            <span className="text-sm">Add to cart</span>
                        </button>
                        <button
                          onClick={handleRefresh}
                            className="px-3 py-2 bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center justify-center"
                          >
                          <FiRefreshCw className="text-white mr-2" />
                          <span className="text-sm">Refresh</span>
                        </button>
                    </div>
                   
                  </div>
                </div>
              </div>
            <div className="w-full flex flex-col">
              {books && books.length > 0 ? (
                <Table
                  books={books}
                  statuses={statuses}
                  quantities={quantities}
                  handleStatusChange={handleStatusChange}
                  handleQuantityChange={handleQuantityChange}
                />
              ) : (
                <p className="text-center text-gray-500">No books Selected</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-black">
                  {/* Card 1: Pack Selection */}
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Choose Your Pack</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="economyPack"
                          name="pack"
                          checked={selectedPack === "Economy Pack"} // Ensure only one checkbox is checked
                          onChange={() => handlePackSelectionInComponent("Economy Pack")}
                          className="hidden" // Hide the default checkbox
                        />
                        <label
                          htmlFor="economyPack"
                          className={`cursor-pointer flex items-center space-x-2 text-lg ${
                            selectedPack === "Economy Pack" ? "text-green-700" : "text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 inline-block border-2 rounded-md ${
                              selectedPack === "Economy Pack" ? "bg-green-700 border-green-700" : "border-gray-400"
                            }`}
                          >
                            {selectedPack === "Economy Pack" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white m-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                          <span>Economy Pack</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="valuePack"
                          name="pack"
                          checked={selectedPack === "Value Pack"}
                          onChange={() => handlePackSelectionInComponent("Value Pack")}
                          className="hidden"
                        />
                        <label
                          htmlFor="valuePack"
                          className={`cursor-pointer flex items-center space-x-2 text-lg ${
                            selectedPack === "Value Pack" ? "text-green-700" : "text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 inline-block border-2 rounded-md ${
                              selectedPack === "Value Pack" ? "bg-green-700 border-green-700" : "border-gray-400"
                            }`}
                          >
                            {selectedPack === "Value Pack" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white m-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                          <span>Value Pack</span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="premiumPack"
                          name="pack"
                          checked={selectedPack === "Premium Pack"}
                          onChange={() => handlePackSelectionInComponent("Premium Pack")}
                          className="hidden"
                        />
                        <label
                          htmlFor="premiumPack"
                          className={`cursor-pointer flex items-center space-x-2 text-lg ${
                            selectedPack === "Premium Pack" ? "text-green-700" : "text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 inline-block border-2 rounded-md ${
                              selectedPack === "Premium Pack" ? "bg-green-700 border-green-700" : "border-gray-400"
                            }`}
                          >
                            {selectedPack === "Premium Pack" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white m-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                          <span>Premium Pack</span>
                        </label>
                      </div>

                      <h3>
                        Our Economy Pack offers essential stationery and school books at a low cost, ensuring
                        affordability for students.
                      </h3>
                    </div>
                  </div>

                {/* Card 2: Totals */}
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-green-700">Basket Summary</h3>
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-t border-b border-gray-300">
                        <td className="py-2 font-medium">Basket Total (Before Discount)</td>
                        <td className="py-2 text-right">Ksh {totals.totalBeforeDiscount}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Discount (4%)</td>
                        <td className="py-2 text-right text-red-500">-Ksh {totals.discount}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Basket Total (After Discount)</td>
                        <td className="py-2 text-right">Ksh {totals.totalAfterDiscount}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Packaging and Delivery</td>
                        <td className="py-2 text-right">Ksh {totals.packagingAndDelivery}</td>
                      </tr>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td className="py-2">Grand Total</td>
                        <td className="py-2 text-right">Ksh {totals.grandTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>


            {hasRemovedSchoolItem&&collectionId ? (
              <div className="mt-2 text-red-700 flex items-center">
                <AiFillWarning className="text-red-700 mr-2 text-2xl" />
                <span className="font-bold">
                A school-recommended item has been removed from the list. This can affect your child&rsquo;s studies. Ensure this is not a mistake.
                </span>
              </div>
            ):
            (
              <div className="mt-2 text-black flex items-center">
                <FaThumbsUp  className="text-green-700 mr-2 text-2xl" />
                <span className="font-bold">
                  You&apos;re all set! You have all the school-recommended items in the list. Good to go.
                </span>
              </div>
            )
            }
          </>
        )}

        {/* Modal */}
        {showModal && mpesaPaymentDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <div className="flex flex-col items-center text-center">
                {paymentSuccess ? (
                  <>
                    <AiOutlineCheckCircle className="text-green-700 text-9xl" />
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-green-700">Payment Successful</h3>
                      <p className="text-gray-700 mt-2">
                        Payment has been made successfully. A receipt of your purchase has been sent to your email.
                      </p>

                      {/* Additional Details */}
                      <div className="mt-4 text-left">
                        <p className="text-gray-700">
                          <span className="font-semibold">Sent to:</span> HARMOSOFTBOOKSTORE
                        </p>
                        <p className="text-gray-700 mt-2">
                          <span className="font-semibold">Amount:</span> Ksh {mpesaPaymentDetails.amount || "N/A"}
                        </p>
                        <p className="text-gray-700 mt-2">
                          <span className="font-semibold">Transaction ID:</span> {mpesaPaymentDetails.transaction_id || "N/A"}
                        </p>
                        <p className="text-gray-700 mt-2">
                          <span className="font-semibold">Order ID:</span> {mpesaPaymentDetails.order.id || "N/A"}
                        </p>
                        <p className="text-gray-700 mt-2">
                          <span className="font-semibold">Timestamp:</span>
                          {new Date(mpesaPaymentDetails.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }) || "N/A"}
                        </p>
                      </div>

                      {/* Done Button */}
                      <div className="mt-6">
                        <button
                          onClick={closeModal}
                          className="bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AiOutlineCloseCircle className="text-red-700 text-9xl" />
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-red-700">Payment Failed</h3>
                      <p className="text-gray-700 mt-2">
                        Unfortunately, the payment was not successful. Please try again.
                      </p>
                    </div>

                    {/* Single Close Button */}
                    <div className="mt-6">
                      <button
                        onClick={closeModal}
                        className="bg-red-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <ConfidenceCard/>
      </div>
      </Suspense>
    </main>
  );
}
