import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { summaryCollection } from '@/handler/Api'; // Import your API function
import { message } from 'antd';
import { IoLogoWhatsapp } from 'react-icons/io';

interface Collection {
  id: number;
  name: string;
  school: Organization;
  code: string;
  grade: string;
}

interface Organization {
  id: string;
  organization_name: string;
}

export default function SearchBar() {
  const [schoolName, setSchoolName] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false); // Track focus
  const router = useRouter();
  let dropdownTimeout: NodeJS.Timeout;

  useEffect(() => {
    // Retrieve schoolName and selectedGrade from sessionStorage on component mount
    const savedSchool = sessionStorage.getItem('schoolName');
    const savedGrade = sessionStorage.getItem('selectedGrade');
    if (savedSchool) setSchoolName(savedSchool);
    if (savedGrade) setSelectedGrade(savedGrade);

    const fetchCollections = async () => {
      const data = await summaryCollection();
      setCollections(data);
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (schoolName) {
      const uniqueSchools = new Set<string>(); // Set to track unique school names
      const filtered = collections.filter(collection => {
        const schoolLower = collection.school.organization_name.toLowerCase();
        if (!uniqueSchools.has(schoolLower) && schoolLower.includes(schoolName.toLowerCase())) {
          uniqueSchools.add(schoolLower);
          return true;
        }
        return false;
      });
      const exactMatch = collections.some(collection =>
        collection.school.organization_name.toLowerCase() === schoolName.toLowerCase()
      );

      setFilteredCollections(exactMatch ? [] : filtered);
    } else {
      setFilteredCollections([]);
    }
  }, [schoolName, collections]);

  const handleSearchClick = async () => {
    setIsLoading(true);

    try {
      const foundCollection = collections.find(collection =>
        collection.school.organization_name.toLowerCase() === schoolName.toLowerCase() &&
        collection.grade.toLowerCase() === selectedGrade.toLowerCase()
      );

      if (foundCollection) {
        // Save the selected school and grade to localStorage
        sessionStorage.setItem('schoolName', schoolName);
        sessionStorage.setItem('selectedGrade', selectedGrade);

        await localStorage.setItem('foundCollection', foundCollection.school.organization_name);
        await localStorage.setItem('foundCollectionGrade', foundCollection.grade);
        await router.push(`/list?collectionId=${foundCollection.id}`);
      } else {
        message.error('No collection found for the specified school and grade.');
      }
    } catch (error) {
      console.error('Error during search operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolSelect = (schoolName: string) => {
    setSchoolName(schoolName);
    setFilteredCollections([]);
    setInputFocused(false); // Hide suggestions when a school is selected
  };

  const openDropdown = () => {
    clearTimeout(dropdownTimeout);
    setDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    dropdownTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const grades = [
    "Play Group", "Pre-Primary 1", "Pre-Primary 2", 
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", 
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", 
    "Grade 10", "Grade 11", "Grade 12"
  ];

  const whatsappNumber = "254722825304";
  const whatsappLink = `https://api.whatsapp.com/send?phone=+${whatsappNumber}&text=Just upload your list and any additional details`;

  return (
    <div className="relative max-w-full w-full bg-white rounded-lg shadow-md p-4 mx-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">Order Your Books</h2>
      <div className="flex flex-col md:flex-row justify-center md:justify-evenly items-center text-black space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 lg:w-1/3 relative "> 
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => {
              setTimeout(() => setInputFocused(false), 200); // Add delay to allow time for click event to register
            }}
            className="p-2 block w-full rounded-md border-gray-300 shadow-sm text-sm sm:text-base focus:border-green-700 focus:ring-green-700"
            placeholder="Enter your School Name"
            autoComplete="off"
          />
          {filteredCollections.length > 0 && inputFocused && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md">
              {filteredCollections.map(collection => (
                <li
                  key={collection.id}
                  onMouseDown={() => handleSchoolSelect(collection.school.organization_name)} // Use onMouseDown to avoid blur triggering first
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {collection.school.organization_name}
                </li>
              ))}
            </ul>
          )}
        </div>
    
        <div className="w-full md:w-1/2 lg:w-1/3">
          <select
            aria-label="Select Grade/Class" // Provides an accessible name
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="p-2 block w-full rounded-md border-gray-300 shadow-sm text-sm sm:text-base focus:border-green-700 focus:ring-green-700"
          >
            <option value="">Select Grade/Class</option>
            {grades.map((grade, index) => (
              <option key={index} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto lg:w-1/4">
          <button
            onClick={handleSearchClick}
            className="w-full md:w-auto px-4 py-2 font-semibold text-sm sm:text-base bg-green-700 text-white rounded-md hover:bg-gray-900 transition-all duration-700 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
            ) : (
              'SEARCH'
            )}
          </button>
        </div>
      </div>
    
      <div className="text-center mt-4">
        <p className="text-sm sm:text-base text-black">
          Didn’t Find Your School? No worries, 
          <button
            onClick={openDropdown}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdownWithDelay}
            className="font-semibold text-sm sm:text-base text-green-600 hover:text-gray-700 ml-2 inline focus:outline-none"
          >
            click here
          </button>
        </p>

        {dropdownOpen && (
          <div
            className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-auto md:w-72 z-50"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdownWithDelay}
            style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="py-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-green-50 border-b border-gray-200"
              >
                Upload the List on Whatsapp
                <IoLogoWhatsapp className="ml-2 text-2xl text-green-700" />
              </a>
              <Link href="/UploadBooksList">
                <span className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-green-50 border-b border-gray-200 cursor-pointer">
                  Upload a Photo of the List Here
                </span>
              </Link>
              <Link href="/books">
                <span className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-green-50 cursor-pointer">
                  Shop Directly from Our Bookstore
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
