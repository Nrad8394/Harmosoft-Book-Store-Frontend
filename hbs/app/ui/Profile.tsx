import React, { useState, useEffect } from "react";
import { getOrganization, updateOrganizations } from "@/handler/Api"; // Import both API functions

interface OrganizationProfile {
  id: string;
  username: string;
  email: string;
  organization_name: string;
  location: string;
  curriculum: string;
  level: string;
  contact_number?: string;
  address?: string;
}

const LOCATIONS = ["Nairobi", "Nakuru", "Mombasa", "Kisumu"];
const LEVELS = ["All", "ECDE & Pre-Primary", "Primary School", "Junior Secondary", "Secondary School"];
const CURRICULUMS = ["CBC", "IGCSE", "ALL"];

export default function Profile() {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [formData, setFormData] = useState<OrganizationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [error, setError] = useState<string | null>(null); // For displaying error messages
  const [image, setImage] = useState<File | null>(null); // For handling image upload

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getOrganization(); // Fetch organization profile
      setProfile(data[0]);
      setFormData(data[0]); // Set form data to fetched profile
    } catch (error) {
      console.error("Failed to fetch organization profile", error);
      setError("Unable to load profile data. Please try again later.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Store selected image file
    }
  };

  const handleFormSubmit = async () => {
    try {
      const formPayload = new FormData();
      if (formData) {
        formPayload.append("username", formData.username);
        formPayload.append("email", formData.email);
        formPayload.append("organization_name", formData.organization_name);
        formPayload.append("location", formData.location);
        formPayload.append("curriculum", formData.curriculum);
        formPayload.append("level", formData.level);
        formPayload.append("address", formData.address || "");
        if (image) {
          formPayload.append("image", image); // Add image file if present
        }

        const updatedProfile = await updateOrganizations(formPayload); // Call API to update profile
        setProfile(updatedProfile); // Update the profile with new data
        setIsEditing(false); // Exit edit mode
        setError(null); // Clear any errors
      }
    } catch (error: any) {
      // Display one of the error messages from the backend response
      const errorMsg:any = error.response?.data ? Object.values(error.response.data)[0] : "Failed to update profile.";
      setError(errorMsg[0]); // Display the first error message
    }
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Organization Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username Field */}
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

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Organization Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input
                type="text"
                name="organization_name"
                value={formData?.organization_name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                name="location"
                value={formData?.location || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Curriculum Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Curriculum</label>
              <select
                name="curriculum"
                value={formData?.curriculum || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {CURRICULUMS.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                name="level"
                value={formData?.level || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Contact Number Field */}
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

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData?.address || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Upload Image(logo)</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
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
