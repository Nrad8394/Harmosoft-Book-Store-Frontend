"use client";

import { FiMail, FiPhoneCall, FiHelpCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function SupportScreen() {
  return (
    <main className="flex flex-col min-h-screen w-full p-4 bg-gray-100">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Support</h2>

        {/* About Us Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-700">About Us</h3>
          <p className="text-gray-700 leading-relaxed">
            We are dedicated to providing the best service possible. Our mission is to ensure that every customer has a smooth and satisfying experience. If you have any questions or issues, our support team is here to help you every step of the way.
          </p>
        </div>

        {/* FAQs Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiHelpCircle className="mr-2 text-green-700" /> Frequently Asked Questions
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-4">
            <li>
              <span className="font-semibold">How do I track my order?</span>
              <p>You can track your order through the &apos;Order Details&apos; section in your account.</p>
            </li>
            <li>
              <span className="font-semibold">How can I change my delivery address?</span>
              <p>You can update your delivery address in the &apos;Delivery Information&apos; section during checkout.</p>
            </li>
            <li>
              <span className="font-semibold">What payment methods do you accept?</span>
              <p>We accept Mpesa and all major credit cards.</p>
            </li>
          </ul>
        </div>

        {/* Email Support Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiMail className="mr-2 text-green-700" /> Contact Us via Email
          </h3>
          <form>
            <div className="mb-4">
              <label
                htmlFor="supportEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                type="email"
                id="supportEmail"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="supportMessage"
                className="block text-sm font-medium text-gray-700"
              >
                Your Message
              </label>
              <textarea
                id="supportMessage"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
                rows= {5}
                placeholder="Describe your issue or question"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Send Email
            </button>
          </form>
        </div>

        {/* Phone and WhatsApp Support Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiPhoneCall className="mr-2 text-green-700" /> Call or WhatsApp Us
          </h3>
          <p className="text-sm text-gray-700">
            You can reach our support team at:
          </p>
          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <FiPhoneCall className="text-green-700 text-xl" />
              <span className="text-md font-medium">
                Phone: <a href="tel:+254722825304" className="hover:underline">+254 722 825304</a>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaWhatsapp className="text-green-700 text-xl" />
              <span className="text-md font-medium">
                WhatsApp: <a href="https://wa.me/254722825304" target="_blank" rel="noopener noreferrer" className="hover:underline">+254 722 825304</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
