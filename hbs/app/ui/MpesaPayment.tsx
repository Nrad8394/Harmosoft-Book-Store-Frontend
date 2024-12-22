"use client";
import Image from "next/image";
import { MdPayment } from "react-icons/md";

interface MpesaPaymentProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  handlePayNow: () => void;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ phoneNumber, setPhoneNumber, handlePayNow }) => {
  return (
    <div className="container bg-white rounded-lg shadow-md p-4 md:p-6 max-w-md mx-auto">
      <h2 className="text-md md:text-lg font-semibold mb-4 flex justify-between items-center">
        Payment Details (Mpesa)
        <div className="relative w-8 h-8 md:w-10 md:h-10 ml-2">
          <Image
            src="/assets/643a7ce98866e442e4a1fe755761a7ed.png"
            alt="Mpesa"
            layout="fill"
            objectFit="contain"
            className="rounded-t-lg"
          />
        </div>
      </h2>
      <div className="mb-4">
        <label htmlFor="mpesaPhoneNumber" className="block text-sm font-medium text-gray-700">
          Mpesa Phone Number
        </label>
        <input
          type="tel"
          id="mpesaPhoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm text-black"
          placeholder="Enter your Mpesa phone number"
          autoComplete="off" // Change to 'off' for valid usage
          inputMode="tel" // Optimizes for telephone input on mobile devices
          pattern="[0-9]*" // Ensures only numbers are accepted
        />
      </div>
      <p className="text-black text-sm md:text-base mb-4">
        NOTE: You will be prompted to enter your M-PESA pin on your mobile phone.
      </p>
      <button
        onClick={handlePayNow}
        className="px-3 py-2 md:px-4 md:py-2 mt-4 w-full bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 flex items-center justify-center space-x-2"
      >
        <MdPayment className="text-white text-lg md:text-xl" />
        <span>PAY NOW</span>
      </button>
    </div>
  );
};

export default MpesaPayment;
