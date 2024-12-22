"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaSave, FaSpinner } from "react-icons/fa";
import { getItems, createCollection, updateCollection } from "@/handler/Api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Item {
  id: number;
  name: string;
  publisher: string;
  price: string;
  sku: string;
}

interface ListItem {
  item: Item;
  quantity: number;
}

interface ShoppingList {
  id?: number;
  name: string;
  grade: string;
  items: ListItem[];
}

export default function ShoppingListEditor() {
  const [list, setList] = useState<ShoppingList>({ name: "", grade: "", items: [] });
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = searchParams.get("isEditing") === "true";
  const listData = JSON.parse(decodeURIComponent(searchParams.get("listData") || "{}"));

  const grades = ["Play Group","Pre-Primary 1","Pre-Primary 2","Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  useEffect(() => {
    if (listData) setList(listData);
    fetchItems();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchItems = async () => {
    const response = await getItems();
    setItems(response);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setFilteredItems([]); // Hide suggestions when clicking outside
    }
  };

  const handleAddItemToList = (item: Item) => {
    if (list.items.some((it) => it.item.id === item.id)) return; // Prevent duplicates

    setList({
      ...list,
      items: [...list.items, { item, quantity: 1 }],
    });
    setSearch(""); // Clear search input
    setFilteredItems([]); // Hide suggestions when an item is selected
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = list.items.filter((_, i) => i !== index);
    setList({ ...list, items: updatedItems });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) &&
        !list.items.some((it) => it.item.id === item.id) // Filter out already added items
    );
    setFilteredItems(filtered);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = Number(value);
    if (isNaN(quantity) || quantity < 1) return; // Prevent invalid quantities

    setList({
      ...list,
      items: list.items.map((it, i) =>
        i === index ? { ...it, quantity } : it // Ensure quantity is stored as a number
      ),
    });
  };

  const handleSaveList = async () => {
    const data = {
      name: list.name,
      grade: list.grade,
      items: list.items.map((listItem) => ({
        item: listItem.item.sku, // Send SKU as item identifier
        quantity: listItem.quantity,
      })),
    };

    try {
      setIsLoading(true);
      if (isEditing) {
        await updateCollection(list.id as number, data); // Update list
      } else {
        await createCollection(data); // Create new list
      }
      setModalMessage("List saved successfully!");
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      setModalMessage(error.message || "Failed to save list.");
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalMessage("");
    if (isSuccess) {
      router.push("/account");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-4">{isEditing ? "Edit List" : "Create New List"}</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="List Name"
          className="p-2 border rounded w-full mb-2"
          value={list.name}
          onChange={(e) => setList({ ...list, name: e.target.value })}
        />
        <select
          value={list.grade}
          onChange={(e) => setList({ ...list, grade: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>Select Grade</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 relative">
        <h4 className="text-lg font-bold">Search and Add Items</h4>
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search for items by name"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="p-2 border rounded w-full"
        />
        {filteredItems.length > 0 && (
          <ul
            ref={suggestionBoxRef}
            className="absolute z-10 bg-white shadow-lg rounded-lg mt-1 w-full max-h-40 overflow-y-auto"
          >
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleAddItemToList(item)}
              >
                {item.name} - <span className="text-gray-500">{item.publisher}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Publisher</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2 border">{item.item.name}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="border p-1 w-16 text-center"
                  />
                </td>
                <td className="p-2 border">{item.item.publisher}</td>
                <td className="p-2 border">{item.item.price}</td>
                <td className="p-2 border">
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteItem(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button className="bg-green-500 text-white p-2 rounded" onClick={handleSaveList} disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaSave /> Save List
            </>
          )}
        </button>
      </div>

      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isSuccess ? "Success" : "Error"}</h2>
            <p>{modalMessage}</p>
            <button
              className={`mt-4 p-2 rounded ${isSuccess ? "bg-green-500" : "bg-red-500"} text-white`}
              onClick={closeModal}
            >
              {isSuccess ? "OK" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
