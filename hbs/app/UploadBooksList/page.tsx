"use client";

import { useState, useEffect } from "react";
import FullWidthSearchBar from "@/app/ui/SearchBarFull";
import CategoryHeader from "@/app/ui/CatHeader";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { getItems } from "@/handler/Api";
interface Book {
  sku: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  visibility: boolean;
  stock_availability: boolean;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
}

export default function UploadBooksListForm() {
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState("");
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("list");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const [activeFilters, setActiveFilters] = useState({
    books: "",
    study_level: "",
    curriculum: "",
    grade: "",
    location: "",
    level: "",
  });
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB.");
        setBookImage(null);
      } else {
        setErrorMessage("");
        setBookImage(file);
      }
    }
  };
  useEffect(() => {
    const fetchCollectionItems = async () => {
      setLoading(true);
      const data = await getItems();
      if (data) {
        setBooksList(data);
        setLoading(false);
      }
    };

    fetchCollectionItems();
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      const suggestions = booksList
        .filter((book: any) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((book: any) => book.name);
      setAutoSuggestions(suggestions);
    } else {
      setAutoSuggestions([]);
    }
  }, [searchTerm, booksList]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookImage) {
      setErrorMessage("Please upload an image.");
      return;
    }
    setErrorMessage("");
    // Submit logic here
    console.log({ schoolName, location, grade, bookImage });
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleRefresh = () => {
    window.location.reload();
  };
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setAutoSuggestions([]);
  };
  const handleClearFilter = () => {
    setActiveCategory(null);
    setActiveFilters({
      books: "",
      study_level: "",
      curriculum: "",
      grade: "",
      location: "",
      level: "",
    });
  };
  const removeFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: "",
    }));
  };
  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };
  return (
  <main className="flex flex-col min-h-screen  w-full p-4 ">
    <div className="w-full flex flex-col items-center">
      <FullWidthSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            activeCategory={activeCategory}
            onClearFilter={handleClearFilter}
            removeFilter={removeFilter}
            suggestions={autoSuggestions}
            onSuggestionClick={handleSuggestionClick}
            activeFilters={activeFilters}
          />

        <CategoryHeader
          onCategoryClick={handleCategoryClick}
        />
    </div>
        <div className="container w-full flex  items-center justify-center mx-auto mt-3">
            <form
                className=" bg-white shadow-md rounded-lg p-6 max-w-md w-full"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                Upload Books List
                </h2>

                {/* School Name */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    School Name
                </label>
                <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
                    placeholder="Enter school name"
                    required
                />
                </div>

                {/* Location */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
                    placeholder="Enter location"
                    required
                />
                </div>

                {/* Grade */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Grade
                </label>
                <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-700 focus:ring-green-700 sm:text-sm"
                    placeholder="Enter grade"
                    required
                />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Upload an image of the books (Max: 5MB)
                </label>
                <input
                    aria-label="upload Image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 p-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-700 file:text-white
                    hover:file:bg-green-600"
                    required
                />
                {errorMessage && (
                    <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
                )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                <button
                    type="submit"
                    className="px-6 py-2 font-semibold text-white bg-green-700 rounded-md hover:bg-green-900 transition-all duration-300"
                >
                    Upload
                </button>
                </div>
            </form>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <div className="flex items-center space-x-4">
                <AiOutlineCheckCircle className="text-green-700 text-9xl" />
                <div>
                  <h3 className="text-lg font-semibold">Successful</h3>
                  <p className="text-gray-700 mt-2">
                  Your Book list has been uploaded successfully.
                  Please wait  for 10 minutes as we update the list into our system.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
