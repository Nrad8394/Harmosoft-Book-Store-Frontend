"use client";
import React, { useState, useEffect } from "react";
import { message } from "antd";
import Pusher from "pusher-js";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import DeliveryInfo from "../ui/DeliveryInfo";
import MpesaPayment from "../ui/MpesaPayment";
import CardPayment from "../ui/CardPayment";
import { useCart } from "../context/CartContext";
import { createOrder, createMpesa, getOrganizationsSummary } from "@/handler/Api";

interface CheckoutModalProps {
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [childName, setChildName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [grade, setGrade] = useState("");
  const [schoolCampus, setSchoolCampus] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Processing...");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mpesaPaymentDetails, setMpesaPaymentDetails] = useState<any>(null);

  // Access cart items and quantities from the cart context
  const { cartItems, quantities } = useCart();

  // Fetch school campuses when the component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const campuses = await getOrganizationsSummary();
        setSchoolCampus(campuses);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handlePayNow = async () => {
    setLoadingMessage("Processing Payments...");
    setLoading(true);

    if (!email || !childName || !deliveryMethod) {
      message.error("Please fill in all the required details.");
      setLoading(false);
      return;
    }

    // Prepare order items from cartItems and quantities
    const orderItems = cartItems.map((item) => ({
      item_id: item.sku,
      quantity: quantities[item.sku] || 1, // default to 1 if no quantity is set
    }));

    const orderData = {
      items: orderItems,
      receipient_name: childName,
      receipt_email: email,
      ...(deliveryMethod === "school"
        ? { organization: schoolId, grade: grade }
        : { delivery_location: deliveryLocation, phone_number: phoneNumber1 }),
    };

    try {
      const orderResponse = await createOrder(orderData);
      const mpesaPayment = await createMpesa({
        orderId: orderResponse.id,
        phone_number: phoneNumber2,
      });
      setMpesaPaymentDetails(mpesaPayment.payment_details);

      const pusher = new Pusher("f238dc2ebfb0118cdc08", { cluster: "mt1" });
      const channel = pusher.subscribe(`order-${orderResponse.id}`);
      channel.bind("transaction-status", (data: any) => {
        if (data.status === "success") {
          setPaymentSuccess(true);
          setLoading(false);
          setShowModal(true);
        } else {
          setPaymentSuccess(false);
          setLoading(false);
          setShowModal(true);
        }
      });
    } catch (error) {
      setPaymentSuccess(false);
      setLoading(false);
      setShowModal(true);
      message.error("An error occurred during payment.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    onClose(); // Close the main modal after closing the payment modal
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>

        {/* Step 1: Delivery Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Step 1: Delivery Information</h2>
          <DeliveryInfo
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            email={email}
            setEmail={setEmail}
            deliveryLocation={deliveryLocation}
            setDeliveryLocation={setDeliveryLocation}
            phoneNumber={phoneNumber1}
            setPhoneNumber={setPhoneNumber1}
            childName={childName}
            setChildName={setChildName}
            schoolCampus={schoolCampus}
            schoolId={schoolId}
            setSchoolId={setSchoolId}
            grade={grade}
            setGrade={setGrade}
          />
        </div>

        {/* Step 2: Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Step 2: Select Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MpesaPayment phoneNumber={phoneNumber2} setPhoneNumber={setPhoneNumber2} handlePayNow={handlePayNow} />
            <CardPayment handlePayNow={handlePayNow} />
          </div>
        </div>

        {/* Modal for payment success or failure */}
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
      </div>
    </main>
  );
};

export default CheckoutModal;
