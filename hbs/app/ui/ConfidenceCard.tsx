"use client";
import { FaCrown, FaCreditCard } from "react-icons/fa";
import { RiMotorbikeFill } from "react-icons/ri";

const ConfidenceCard = () => {
  return (
    <div className="m-2 border-2 border-dotted border-gray-400 rounded-lg p-6 flex flex-col md:flex-row md:justify-between space-y-6 md:space-y-0 w-full">
      {/* Quality Guaranteed */}
      <div className="flex items-start space-x-4 md:space-x-2 lg:space-x-4">
        <FaCrown className="text-green-600 text-3xl" />
        <div>
          <h3 className="text-lg font-semibold text-green-600">Quality Guaranteed</h3>
          <p className="text-gray-700">We guarantee quality goods.</p>
        </div>
      </div>

      {/* Secure Payment */}
      <div className="flex items-start space-x-4 md:space-x-2 lg:space-x-4">
        <FaCreditCard className="text-green-600 text-3xl" />
        <div>
          <h3 className="text-lg font-semibold text-green-600">Secure Payment</h3>
          <p className="text-gray-700">We ensure payment protection.</p>
        </div>
      </div>

      {/* Delivery */}
      <div className="flex items-start space-x-4 md:space-x-2 lg:space-x-4">
        <RiMotorbikeFill className="text-green-600 text-3xl" />
        <div>
          <h3 className="text-lg font-semibold text-green-600">Delivery</h3>
          <p className="text-gray-700">Timely and secure deliveries.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceCard;
