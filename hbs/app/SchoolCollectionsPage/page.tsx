"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSchoolCollections } from "@/handler/Api";
import CollectionModal from "../ui/CollectionModal ";

export interface Collection {
  id: string;
  name: string;
  school: string;
  grade: string;
}

export default function SchoolCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading collections...");
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [schoolCollectionsName, setSchoolCollectionsName] = useState("")

  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const schoolName = searchParams.get('schoolName');

  const handleCollectionClick = (collection: any) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCollection(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      if (!schoolId) return;
      setLoading(true);
      const data = await getSchoolCollections(schoolId as string);
      if (data) {
        setCollections(data.collections);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [schoolId]);

  const filteredCollections = collections.filter((collection) =>
    selectedGrade === "ALL" ? true : collection.grade === selectedGrade
  );

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setIsSidebarOpen(false); // Close the sidebar when a grade is selected
  };

  const renderCollections = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-green-700 rounded-lg shadow-md flex items-end space-x-4">
            <div className="bg-white flex items-center h-full p-3 ml-10 space-x-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-transparent border-solid border-8 border-green-700"></div>
              <p className="text-lg font-semibold text-green-700">{loadingMessage}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {filteredCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3 p-4"
            onClick={() => handleCollectionClick(collection)}
          >
            <h3 className="font-bold text-lg">{collection.name}</h3>
            <p>{`Grade: ${collection.grade}`}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-gray-200 h-full transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:relative sm:translate-x-0 sm:w-64 w-64 p-4`}
    >
      <button
        className="sm:hidden p-2 text-right w-full text-red-700"
        onClick={toggleSidebar}
      >
        ✕ Close 
      </button>
      <h3 className="font-bold text-lg mb-4">Filter by Grade</h3>
      <ul>
        {[
          "ALL",
          "Play Group",
          "Pre-Primary 1",
          "Pre-Primary 2",
          "Grade 1",
          "Grade 2",
          "Grade 3",
          "Grade 4",
          "Grade 5",
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
          "Grade 11",
          "Grade 12",
        ].map((grade) => (
          <li
            key={grade}
            className={`cursor-pointer p-2 ${
              selectedGrade === grade ? "bg-green-500 text-white" : ""
            }`}
            onClick={() => handleGradeChange(grade)}
          >
            {grade}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="flex min-h-screen">
      <button
        className="sm:hidden p-1 bg-green-500 text-white fixed z-50 top-12 left-0 mt-6  text-xs"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "Close Filters" : "Open Filters"}
      </button>
      {renderSidebar()}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-bold mb-6">{schoolName} {selectedGrade} Lists</h2>
        {renderCollections()}
      </div>
      {selectedCollection && (
        <CollectionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          collection={selectedCollection}
          schoolCollectionsName={schoolCollectionsName}
        />
      )}
    </main>
  );
}
