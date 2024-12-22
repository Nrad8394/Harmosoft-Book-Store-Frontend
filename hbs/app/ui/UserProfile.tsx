import React, { useState, useEffect } from "react";
import { getIndividual } from "@/handler/Api";
import { UpdateIndividual } from "@/handler/Api"; // Import the update API call

interface UserData {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login?: string;
  image?: string;
  contact_number?: string;
  user_type: string;
  date_of_birth?: string | null;
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getIndividual();
        setUserData(data[0]);
        setFormData(data[0]); // Initialize form data
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Unable to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (formData) {
        const updatedUser = await UpdateIndividual(formData); // Call the API to update the user data
        setUserData(updatedUser); // Update userData with the updated information
        setIsEditing(false); // Disable editing mode
        setError(null); // Clear any error
      }
    } catch (error) {
      console.error("Failed to update user data", error);
      setError("Failed to update user data. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData?.username || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>
        {/* Additional User Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData?.first_name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData?.last_name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                value={formData?.contact_number || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <input
                type="text"
                name="user_type"
                value={formData?.user_type || ""}
                onChange={handleInputChange}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        {isEditing ? (
          <button
            onClick={handleFormSubmit}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900 transition-all duration-700"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900 transition-all duration-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
