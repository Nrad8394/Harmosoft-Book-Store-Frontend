import { useState, useEffect, useRef } from "react";
import { useItems } from "../context/itemContext";

// Update the DropdownMenu type to match Filters keys
type DropdownMenu = "category" | "study_level" | "curriculum" | "grade";

interface CategoryHeaderProps {
  onCategoryClick: (category: string) => void;
}

export default function CategoryHeader({ onCategoryClick }: CategoryHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState({
    category: false, // Changed from "books" to "category"
    study_level: false,
    curriculum: false,
    grade: false,
  });

  const dropdownRefs = useRef({
    category: useRef<HTMLDivElement>(null), // Changed from "books" to "category"
    study_level: useRef<HTMLDivElement>(null),
    curriculum: useRef<HTMLDivElement>(null),
    grade: useRef<HTMLDivElement>(null),
  });

  const { filters, setFilter, clearFilters } = useItems(); // Using the context

  const toggleDropdown = (menu: DropdownMenu) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const closeDropdown = (menu: DropdownMenu) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: false,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((menu) => {
        const ref = dropdownRefs.current[menu as DropdownMenu].current;
        if (ref && !ref.contains(event.target as Node)) {
          closeDropdown(menu as DropdownMenu);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getActiveClass = (dropdown: DropdownMenu) => {
    return filters[dropdown]
      ? "text-green-700 border-b-2 border-gray-200 shadow-md"
      : "hover:text-green-700";
  };

  const getFilteredGrades = () => {
    const { study_level, curriculum } = filters;
    let grades: string[] = [];

    if (!curriculum || curriculum === "CBC") {
      if (!study_level) {
        grades = [
          "Play Group", "Pre-Primary 1", "Pre-Primary 2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
        ];
      } else if (study_level === "ECDE & Pre-Primary") {
        grades = ["Play Group", "Pre-Primary 1", "Pre-Primary 2"];
      } else if (study_level === "Primary School") {
        grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
      } else if (study_level === "Junior Secondary") {
        grades = ["Grade 7", "Grade 8", "Grade 9"];
      } else if (study_level === "Secondary School") {
        grades = ["Grade 10", "Grade 11", "Grade 12"];
      }
    } else if (curriculum === "IGCSE") {
      grades = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"];
    }

    return grades;
  };

  const filteredGrades = getFilteredGrades();

  const renderFilterButton = (filterType: DropdownMenu, label: string, options: string[]) => (
    <div className="relative" ref={dropdownRefs.current[filterType]}>
      <button
        className={`focus:outline-none text-sm ${getActiveClass(filterType)} flex items-center border border-gray-200 shadow-md rounded-md p-2 my-2`}
        onClick={() => toggleDropdown(filterType)}
      >
        {filters[filterType] ? (
          <span className="flex items-center">
            <p className="text-xs md:text-sm">{filters[filterType]}{" "}</p>
            <button
              onClick={() => setFilter(filterType, "")} // Updated to use setFilter with an empty string
              className="text-red-600 font-bold ml-2"
            >
              X
            </button>
          </span>
        ) : (
          <span className="flex items-center">
            <p className="text-xs md:text-sm">{label}</p>
            <span className="ml-1">&#x25BC;</span> {/* Down arrow indicator */}
          </span>
        )}
      </button>
      {dropdownOpen[filterType] && !filters[filterType] && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-40 p-2 w-48">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                className="hover:bg-gray-100 p-2 cursor-pointer"
                onClick={() => setFilter(filterType, option)} // Apply filter using setFilter
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-300 w-full shadow rounded-lg">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-around w-full h-full">
          <div className="bg-green-700 h-full p-1 md:p-5 md:rounded-l-lg shadow-md cursor-pointer hover:bg-green-800 transition duration-300">
            <h2 className="md:text-xl font-semibold text-white text-center md:text-left">Categories</h2>
          </div>

          <nav className="flex flex-row items-center justify-around gap-2 md:gap-4 w-full px-3">
            {renderFilterButton("category", "Books", ["Teachers Guide", "Textbooks", "Workbooks", "Exercise Books", "Stationery", "Storybooks"])}
            {renderFilterButton("study_level", "Study Levels", ["ECDE & Pre-Primary", "Primary School", "Junior Secondary", "Secondary School"])}
            {renderFilterButton("curriculum", "Curriculum", ["CBC", "IGCSE"])}
            {renderFilterButton("grade", "Grade", filteredGrades)}
          </nav>
        </div>
      </div>
    </header>
  );
}
