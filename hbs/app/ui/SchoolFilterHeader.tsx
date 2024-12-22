import React, { useState, useRef, useEffect } from "react";

interface Filters {
  location?: string;
  level?: string;
  curriculum?: string;
}

interface SchoolFilterHeaderProps {
  activeFilters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string) => void;
  removeFilter: (filterType: keyof Filters) => void;
}

export default function SchoolFilterHeader({
  activeFilters,
  onFilterChange,
  removeFilter,
}: SchoolFilterHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState({
    location: false,
    level: false,
    curriculum: false,
  });

  const dropdownRefs = useRef({
    location: useRef<HTMLDivElement>(null),
    level: useRef<HTMLDivElement>(null),
    curriculum: useRef<HTMLDivElement>(null),
  });

  const toggleDropdown = (menu: keyof Filters) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const closeDropdown = (menu: keyof Filters) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: false,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((menu) => {
        const ref = dropdownRefs.current[menu as keyof Filters].current;
        if (ref && !ref.contains(event.target as Node)) {
          closeDropdown(menu as keyof Filters);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getActiveClass = (dropdown: keyof Filters) => {
    return activeFilters[dropdown]
      ? "text-green-700 border-b-2 border-gray-200 shadow-md"
      : "hover:text-green-700";
  };

  const renderFilterButton = (filterType: keyof Filters, label: string, options: string[]) => (
    <div className="relative" ref={dropdownRefs.current[filterType]}>
      <button
        className={`focus:outline-none text-sm ${getActiveClass(filterType)} flex items-center border border-gray-200 shadow-md rounded-md p-2 my-2`}
        onClick={() => toggleDropdown(filterType)}
      >
        {activeFilters[filterType] ? (
          <span className="flex items-center">
            <p className="text-xs md:text-sm">{activeFilters[filterType]}{" "}</p>
            <button
              onClick={() => removeFilter(filterType)}
              className="text-green-700 font-bold ml-2"
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
      {dropdownOpen[filterType] && !activeFilters[filterType] && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-2 w-48">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                className="hover:bg-gray-100 p-2 cursor-pointer"
                onClick={() => onFilterChange(filterType, option)}
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
            <h2 className="md:text-xl font-semibold text-white text-center md:text-left">Filters</h2>
          </div>

          <nav className="flex flex-row items-center justify-around gap-2 md:gap-4 w-full px-3 ">
            {renderFilterButton("location", "Location", ["Nairobi", "Nakuru", "Mombasa","Kisumu"])}
            {renderFilterButton("level", "Study Level", ["All", "ECDE & Pre-Primary", "Primary School", "Junior Secondary", "Secondary School"])}
            {renderFilterButton("curriculum", "Curriculum", ["CBC", "IGCSE"])}
          </nav>
        </div>
      </div>
    </header>
  );
}
