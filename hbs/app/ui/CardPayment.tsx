"use client";
import Image from "next/image";
import { AiOutlineCreditCard } from "react-icons/ai";

interface CardPaymentProps {
  handlePayNow: () => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({ handlePayNow }) => {
  return (
    <div className="container bg-white rounded-lg shadow-md p-4 md:p-6 max-w-md mx-auto">
      <h2 className="text-md md:text-lg font-semibold mb-4 flex justify-between items-center">
        Payment Details (Card)
        <div className="relative w-8 h-8 md:w-10 md:h-10 ml-2">
          <Image
            src="/assets/visa.jpg"
            alt="Visa"
            layout="fill"
            objectFit="contain"
            className="rounded-t-lg"
          />
        </div>
      </h2>
      <p className="text-black text-sm md:text-base mb-4">Card information</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 text-sm md:text-base"
            placeholder="Enter your card number"
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 text-sm md:text-base"
              placeholder="MM/YY"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 text-sm md:text-base"
              placeholder="CVV"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handlePayNow}
        className="px-3 py-2 md:px-4 md:py-2 mt-4 w-full bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center justify-center space-x-2"
      >
        <AiOutlineCreditCard className="text-white text-lg md:text-xl" />
        <span>PAY NOW</span>
      </button>
    </div>
  );
};

export default CardPayment;
