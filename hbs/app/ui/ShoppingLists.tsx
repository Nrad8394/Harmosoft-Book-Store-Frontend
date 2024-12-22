import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { getSchoolCollections,deleteCollection } from "@/handler/Api";
import { useRouter } from "next/navigation"; // For navigation
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
export default function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchExistingLists(); // Fetch existing shopping lists on mount
  }, []);

  const fetchExistingLists = async () => {
    if (user && user.id) {
      try {
        const response = await getSchoolCollections(user.id);
        setShoppingLists(response.collections || []);
      } catch (error) {
        console.error("Error fetching shopping lists:", error);
      }
    }
  };

  const handleEditList = (list: any) => {
    const listData = encodeURIComponent(JSON.stringify(list));
    router.push(`/shoppinglisteditor?listData=${listData}&isEditing=true`);
  };

  const handleAddNewList = () => {
    const listData = encodeURIComponent(JSON.stringify({ name: "", grade: "", items: [] }));
    router.push(`/shoppinglisteditor?listData=${listData}&isEditing=false`);
  };

  const handleDeleteList = async (listId: number) => {
    const confirmed = confirm("Are you sure you want to delete this list?");
    if (confirmed) {
      try{
        await deleteCollection(listId);
        const updatedLists = shoppingLists.filter((list) => list.id !== listId);
        message.success("Deleting list Successfull")
        setShoppingLists(updatedLists);
      // Optionally call API to delete from backend
      }
      catch(error){
        message.error("Deleting list failed")
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-4">Manage Shopping Lists for {user?.first_name}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shoppingLists.length > 0 ? (
          shoppingLists.map((list) => (
            <div key={list.id} className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="font-bold">{list.name}</h4>
              <p>Grade: {list.grade}</p>
              <div className="flex space-x-4">
                <button
                  className="flex items-center justify-center bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition-colors duration-200 w-24"
                  onClick={() => handleEditList(list)}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  className="flex items-center justify-center bg-red-500 text-white p-2 rounded shadow hover:bg-red-600 transition-colors duration-200 w-24"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No shopping lists found.</p>
        )}

        {/* New List Card */}
        <div
          onClick={handleAddNewList}
          className="flex items-center justify-center p-4 bg-gray-200 rounded-lg cursor-pointer"
        >
          <FaPlus className="text-3xl text-gray-700" />
        </div>
      </div>
    </div>
  );
}
