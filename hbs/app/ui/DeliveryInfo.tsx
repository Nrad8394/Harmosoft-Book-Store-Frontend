"use client";
import React, { useState } from "react";

interface DeliveryInfoProps {
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
  email: string;
  setEmail: (email: string) => void;
  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  childName: string;
  setChildName: (name: string) => void;
  schoolCampus: any[]; // Array of school campuses
  grade: string;
  setGrade: (grade: string) => void;
  schoolId: string;
  setSchoolId: (schoolId: string) => void;
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  deliveryMethod,
  setDeliveryMethod,
  email,
  setEmail,
  deliveryLocation,
  setDeliveryLocation,
  phoneNumber,
  setPhoneNumber,
  childName,
  setChildName,
  schoolCampus,
  grade,
  setGrade,
  schoolId,
  setSchoolId
}) => {
  const [filteredCampuses, setFilteredCampuses] = useState<any[]>([]);
  const [schoolInput, setSchoolInput] = useState(""); // To manage the input value for the school
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSchoolInputChange = (inputValue: string) => {
    setSchoolInput(inputValue); // Update the input field value

    // Filter the school campuses based on the input
    const filtered = schoolCampus.filter((school) =>
      school.organization_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredCampuses(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (school: any) => {
    setSchoolInput(school.organization_name); // Update the input field with the selected school
    setSchoolId(school.id); // Set the selected school ID
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    // Delay hiding the suggestions to allow clicks on the suggestions
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return (
    <div className="container bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Receipt Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Choose Delivery Method</label>
        <div className="flex items-center space-x-4 mt-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="deliveryMethod"
              value="home"
              checked={deliveryMethod === "home"}
              onChange={() => setDeliveryMethod("home")}
              className="h-4 w-4 text-green-700 border-gray-300 focus:ring-green-700"
              required
            />
            <span className="ml-2">Delivery at Home</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="deliveryMethod"
              value="school"
              checked={deliveryMethod === "school"}
              onChange={() => setDeliveryMethod("school")}
              className="h-4 w-4 text-green-700 border-gray-300 focus:ring-green-700"
            />
            <span className="ml-2">Delivery at School</span>
          </label>
        </div>
      </div>

      {deliveryMethod === "home" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">
              Delivery Location
            </label>
            <input
              type="text"
              id="deliveryLocation"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              placeholder="Enter your delivery location"
              required
            />
          </div>
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
              Child&apos;s Name
            </label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              placeholder="Enter your child's name"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
      )}

      {deliveryMethod === "school" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
              Child&apos;s Name
            </label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              placeholder="Enter your child's name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="schoolCampus" className="block text-sm font-medium text-gray-700">
              School Campus
            </label>
            <input
              type="text"
              id="schoolCampus"
              value={schoolInput} // Use schoolInput as the value
              onChange={(e) => handleSchoolInputChange(e.target.value)} // Handle input change
              onBlur={handleInputBlur} // Handle input blur
              onFocus={() => setShowSuggestions(true)} // Show suggestions when focused
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              placeholder="Start typing the school name..."
              required
            />
            {showSuggestions && filteredCampuses.length > 0 && (
              <ul className="border bg-white rounded-md shadow-lg mt-2 max-h-48 overflow-y-auto">
                {filteredCampuses.map((school) => (
                  <li
                    key={school.id}
                    onMouseDown={() => handleSuggestionClick(school)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {school.organization_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
              required
            >
              <option value="">Select</option>
              <option value="play_group">Play Group</option>
              <option value="pp1">Pre-primary one</option>
              <option value="pp2">Pre-primary two</option>
              <option value="one">Grade One</option>
              <option value="two">Grade Two</option>
              <option value="three">Grade Three</option>
              <option value="four">Grade Four</option>
              <option value="five">Grade Five</option>
              <option value="six">Grade Six</option>
              <option value="seven">Grade Seven</option>
              <option value="eight">Grade Eight</option>
              <option value="nine">Grade Nine</option>
              <option value="ten">Grade Ten</option>
              <option value="eleven">Grade Eleven</option>
              <option value="twelve">Grade Twelve</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
