// components/ui/OrganizationManagement.tsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { getOrganizationsSummary, addOrganization, updateOrganization, deleteOrganization } from "@/handler/Api";

// Dropdown choices for Location, Level, and Curriculum
const LOCATION_CHOICES = [
  { value: 'Nairobi', label: 'Nairobi Metropolitan' },
  { value: 'Nakuru', label: 'Nakuru One' },
  { value: 'Mombasa', label: 'Mombasa' },
  { value: 'Kisumu', label: 'Kisumu' },
];

const LEVEL_CHOICES = [
  { value: 'All', label: 'ALL' },
  { value: 'ECDE & Pre-Primary', label: 'ECDE & Pre-Primary' },
  { value: 'Primary School', label: 'Primary School' },
  { value: 'Junior Secondary', label: 'Junior School' },
  { value: 'Secondary School', label: 'Secondary School' },
];

const CURRICULUM_CHOICES = [
  { value: 'CBC', label: 'CBC' },
  { value: 'IGCSE', label: 'IGCSE' },
  { value: 'ALL', label: 'ALL' },
];

interface Collection {
  id: string;
  name: string;
  grade: string;
}

interface Organization {
  id: string;
  username: string;
  email: string;
  organization_name: string;
  location: string;
  verified: boolean;
  level: string;
  curriculum: string;
  collection: Collection[];
}

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrganization, setNewOrganization] = useState<Partial<Organization>>({});
  const [isEditing, setIsEditing] = useState<string | null>(null); // Track the ID of the organization being edited
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await getOrganizationsSummary();
      setOrganizations(data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setError("Unable to load organizations. Please try again later.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewOrganization({ ...newOrganization, [e.target.name]: e.target.value });
  };

  const handleAddOrganization = async () => {
    if (newOrganization.username && newOrganization.email) {
      try {
        const added = await addOrganization(newOrganization); // API call to add
        setOrganizations([...organizations, added]);
        setNewOrganization({});
        setError(null);
      } catch (error) {
        setError("Failed to add organization. Please try again.");
      }
    } else {
      setError("Username and email are required.");
    }
  };

  const handleEditOrganization = (org: Organization) => {
    setIsEditing(org.id);
    setNewOrganization(org);
  };

  const handleUpdateOrganization = async () => {
    if (isEditing !== null) {
      try {
        const updated = await updateOrganization(isEditing, newOrganization); // API call to update
        setOrganizations(
          organizations.map((org) => (org.id === isEditing ? updated : org))
        );
        setNewOrganization({});
        setIsEditing(null);
        setError(null);
      } catch (error) {
        setError("Failed to update organization. Please try again.");
      }
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this organization?");
    if (confirmed) {
      try {
        await deleteOrganization(id); // API call to delete
        setOrganizations(organizations.filter((org) => org.id !== id));
        setError(null);
      } catch (error) {
        setError("Failed to delete organization. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-bold mb-4">Organization Management</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Organization List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md mb-6">
          <thead>
            <tr>
              <th className="p-2 border">Organization Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Curriculum</th>
              <th className="p-2 border">Verified</th>
              <th className="p-2 border">Collection</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <tr key={org.id}>
                  <td className="p-2 border">{org.organization_name}</td>
                  <td className="p-2 border">{org.email}</td>
                  <td className="p-2 border">{org.location}</td>
                  <td className="p-2 border">{org.level}</td>
                  <td className="p-2 border">{org.curriculum}</td>
                  <td className="p-2 border">{org.verified ? "Yes" : "No"}</td>
                  <td className="p-2 border">
                    {org.collection.map((col) => (
                      <p key={col.id}>
                        {col.name} - {col.grade}
                      </p>
                    ))}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-blue-500 text-white p-1 rounded mr-2"
                      onClick={() => handleEditOrganization(org)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-1 rounded"
                      onClick={() => handleDeleteOrganization(org.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  No organizations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form */}
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h4 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Organization" : "Add New Organization"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              name="organization_name"
              value={newOrganization.organization_name || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newOrganization.email || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              name="location"
              value={newOrganization.location || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Location</option>
              {LOCATION_CHOICES.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Curriculum</label>
            <select
              name="curriculum"
              value={newOrganization.curriculum || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Curriculum</option>
              {CURRICULUM_CHOICES.map((curriculum) => (
                <option key={curriculum.value} value={curriculum.value}>
                  {curriculum.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              name="level"
              value={newOrganization.level || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Level</option>
              {LEVEL_CHOICES.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          {isEditing ? (
            <button
              onClick={handleUpdateOrganization}
              className="bg-green-500 text-white p-2 rounded mr-2"
            >
              Update Organization
            </button>
          ) : (
            <button
              onClick={handleAddOrganization}
              className="bg-blue-500 text-white p-2 rounded"
            >
              <FaPlus className="mr-2" /> Add Organization
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
