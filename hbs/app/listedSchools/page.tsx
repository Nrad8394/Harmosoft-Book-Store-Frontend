"use client";

import { useState, useEffect, useRef } from "react";
import FullWidthSearchBar from "../ui/SearchBarFull";
import SchoolFilterHeader from "../ui/SchoolFilterHeader";
import { getOrganizationsSummary, getAdverts, getSchoolCollections } from "@/handler/Api";
import CollectionModal from "../ui/CollectionModal ";
import Image from 'next/image'; // Import the Image component from Next.js
import AdvertsSection from "../ui/AdvertsSection"; // Import AdvertsSection
import { AiOutlineClear } from "react-icons/ai";
import { BsFileEarmarkPdf } from "react-icons/bs";

interface School {
  id: string;
  organization_name: string;
  location: string;
  level: string;
  curriculum: string;
  collection: Collection[];
  email: string;
  address: string;
  image: string | null;
  status: string;
}

interface Collection {
  id: string;
  name: string;
  school: string;
  grade: string;
}

interface Advert {
  id: string;
  title: string;
  image: string | null;
  advert_type: string;
  organization: string;
}

export default function SchoolsPage() {
  const [schoolsList, setSchoolsList] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading Schools...");
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    location: "",
    level: "",
    curriculum: "",
    books: "",
    grade: "",
    study_level: "",
  });
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolsPerPage, setSchoolsPerPage] = useState(10);
  const [seeAllState, setSeeAllState] = useState<{ [key: string]: boolean }>({});
  const [schoolCollections, setSchoolCollections] = useState<Collection[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [schoolCollectionsName, setSchoolCollectionsName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchSchoolsAndAdverts = async () => {
      setLoading(true);
      setError(null);
      try {
        const schoolsData = await getOrganizationsSummary();
        const advertsData = await getAdverts();
        if (schoolsData) {
          setSchoolsList(schoolsData);
        }
        if (advertsData) {
          setAdverts(advertsData);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolsAndAdverts();
  }, []);

  // Handle search term and autosuggestions
  useEffect(() => {
    if (searchTerm) {
      const suggestions = schoolsList
        .filter((school) =>
          school.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((school) => school.organization_name);
      setAutoSuggestions(suggestions);
    } else {
      setAutoSuggestions([]);
    }
  }, [searchTerm, schoolsList]);

  // Fetch school collections when a school is selected
  useEffect(() => {
    if (selectedSchool) {
      const fetchCollections = async () => {
        try {
          const collections = await getSchoolCollections(selectedSchool.id);
          setSchoolCollections(collections.collections);
        } catch (err) {
          console.error("Error fetching collections:", err);
        }
      };
      fetchCollections();
    }
  }, [selectedSchool]);

  

  const filterSchools = (
    schools: School[],
    filters: typeof activeFilters,
    searchTerm: string
  ) => {
    const prioritizedSchools = [
      "MAKINI",
      "RIARA",
      "KILIMANI JUNIOR ACADEMY",
      "BANDA SCHOOL-PRI",
      "St.Peter's Primary",
      "ST. ELIZABETH ACADEMY PRI",
      "Juja Preparatory",
      "MAKENA JUJA",
      "ST. CHRISTOPHER'S PREP. SCH - PRI",
      "ST. HANNAH'S PREPARATORY SCH - PRI"
    ];
  
    return schools
      .filter((school) => {
        const searchMatch = school.organization_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const locationMatch = filters.location ? school.location === filters.location : true;
        const levelMatch = filters.level ? school.level === filters.level : true;
        const curriculumMatch = filters.curriculum
          ? school.curriculum === filters.curriculum
          : true;
        return searchMatch && locationMatch && levelMatch && curriculumMatch;
      })
      .sort((a, b) => {
        const aIncludes = a.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const bIncludes = b.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return aIncludes && !bIncludes ? -1 : !aIncludes && bIncludes ? 1 : 0;
      })
      .sort((a, b) => (a.status === "Private" ? -1 : 1))
      .sort((a, b) => {
        const isAPrioritized = prioritizedSchools.includes(a.organization_name?.toUpperCase() || "");
        const isBPrioritized = prioritizedSchools.includes(b.organization_name?.toUpperCase() || "");
        if (isAPrioritized && !isBPrioritized) return -1;
        if (!isAPrioritized && isBPrioritized) return 1;
        return 0;
      });
      
  };
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilter = () => {
    setActiveFilters({
      location: "",
      level: "",
      curriculum: "",
      books: "",
      grade: "",
      study_level: "",
    });
    setSearchTerm("");
  };

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);
  };

  const handleSeeAllToggle = (category: string) => {
    setSeeAllState((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleCollectionClick = (collection: any, name: string) => {
    setSchoolCollectionsName(name);
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCollection(null);
  };

  const renderSelectedSchoolDetails = () => {
    if (!selectedSchool) return null;
  
    return (
      <div className="flex-grow w-full flex flex-col items-center my-auto h-full relative rounded-md shadow-md ">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
          onClick={() => setSelectedSchool(null)}
        >
          &times;
        </button>
        <div className="space-y-2 bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-row">
            <Image
              src="/assets/schoollogo.jpg"
              alt="School logo"
              width={96}
              height={64}
              className="mb-4 m-auto"
            />
            <div className="w-2/3 " >
              <p className="text-center">
                <strong>{selectedSchool.organization_name}</strong>
              </p>
              <p>
                <strong>Location:</strong> <span className="text-black">{selectedSchool.address || selectedSchool.location}</span>
              </p>
              <p>
                <strong>Email:</strong> <span className="text-black">{selectedSchool.email}</span>
              </p>
              {/* <p>
                <strong>Level:</strong> <span className="text-black">{selectedSchool.level}</span>
              </p> */}
              <p>
                <strong>Curriculum:</strong> <span className="text-black">{selectedSchool.curriculum}</span>
              </p>
            </div>
          </div>
          
          {schoolCollections.length > 0 ? (
            <div className="flex flex-col gap-4">
              {schoolCollections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection, selectedSchool.organization_name)}
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-md shadow-md cursor-pointer"
                >
                  <BsFileEarmarkPdf style={{ color: 'green', fontSize: '24px' }} />
                  <span className="underline text-black">{collection.name}.pdf</span>
                  <span className="ml-auto text-black">{collection.grade}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">No collections available for this school.</p>
          )}
        </div>
      </div>
    );
  };
  

  const renderSchoolSections = () => {
    const filteredSchools = filterSchools(schoolsList, activeFilters, searchTerm);

    return (
      <div className="w-full mb-3 p-2 sm:p-4 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row items-start justify-between">
        <div className="sm:w-1/3 w-full p-2">
          <div className="flex flex-row text-center justify-between">
            <h2 className="text-lg font-bold mb-2">
              {Object.values(activeFilters).filter(Boolean).join(", ") || "All Schools"}
            </h2>
            <div className="flex justify-end">
              {/* <a
                onClick={handleClearFilter}
                className="mt-2 text-black hover:text-green-700 cursor-pointer text-sm"
              >
                <span className="flex flex-row items-center gap-2"><AiOutlineClear /> Clear Filters</span>
              </a> */}
              <a
                  onClick={() => handleSeeAllToggle("schools")}
                  className="mt-2 text-black hover:text-green-700 cursor-pointer text-sm"
                >
                  {seeAllState["schools"] ? "See Less" : "See All"}
              </a>
            </div>
          </div>
          <div className="space-y-2 h-screen max-h-screen overflow-y-auto">
            {filteredSchools
              .slice(0, seeAllState["schools"] ? filteredSchools.length : schoolsPerPage)
              .map((school) => (
                <div
                  key={school.id}
                  className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-md shadow-md"
                  onClick={() => handleSchoolClick(school)}
                >
                  <h3 className="text-sm font-semibold">{school.organization_name}</h3>
                  <p className="text-xs text-gray-600">
                    {school.level} | {school.curriculum}|{school.status}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex justify-end">
            <a
              onClick={() => handleSeeAllToggle("schools")}
              className="mt-2 text-black hover:text-green-700 cursor-pointer text-sm"
            >
              {seeAllState["schools"] ? "See Less" : "See All"}
            </a>
          </div>
        </div>

        <div className="sm:w-2/3 w-full flex-grow mx-auto">
        {selectedSchool ? renderSelectedSchoolDetails() : <AdvertsSection adverts={adverts} />}
        </div>
      </div>
    );
  };

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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full p-2 sm:p-4" ref={topRef}>
      <div className="m-auto w-full">
        <FullWidthSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          activeCategory={null}
          onClearFilter={handleClearFilter}
          suggestions={autoSuggestions}
          onSuggestionClick={(suggestion) => setSearchTerm(suggestion)}
          activeFilters={activeFilters}
          removeFilter={(filterType) =>
            setActiveFilters((prev) => ({ ...prev, [filterType]: "" }))
          }
        />
        <SchoolFilterHeader
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          removeFilter={(filterType) =>
            setActiveFilters((prev) => ({ ...prev, [filterType]: "" }))
          }
        />
        <div className="schools-list mt-2 h-full w-full">{renderSchoolSections()}</div>
      </div>
      {selectedCollection && (
        <CollectionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          collection={selectedCollection}
          schoolCollectionsName={schoolCollectionsName}
        />
      )}
      <div ref={bottomRef} className="mt-20"></div>
    </main>
  );
}
