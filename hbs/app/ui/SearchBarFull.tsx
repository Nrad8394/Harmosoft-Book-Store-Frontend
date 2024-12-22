import { FaSearch } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";

interface FullWidthSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeCategory: string | null;
  onClearFilter: () => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  activeFilters:
    | {
        location: string;
        level: string;
        curriculum: string;
      }
    | {
        books: string;
        study_level: string;
        curriculum: string;
        grade: string;
      }
    | undefined;
  removeFilter: (
    filterType:
      | "location"
      | "study_level"
      | "curriculum"
      | "books"
      | "level"
      | "grade"
  ) => void;
}

export default function FullWidthSearchBar({
  searchTerm,
  onSearchChange,
  activeCategory,
  onClearFilter,
  suggestions,
  onSuggestionClick,
  activeFilters = { location: "", level: "", curriculum: "" }, // Default value
  removeFilter,
}: FullWidthSearchBarProps) {
  // const hasActiveFilters =activeFilters && Object.values(activeFilters).some((value) => value !== "");
  const hasActiveFilters =false;

  return (
    <div className="max-w-full rounded-lg shadow-md shadow-gray-500 w-full flex flex-col items-center bg-white mx-auto  mb-2 relative">
      {/* Filter and Search Bar */}
      <div className="w-full flex items-center relative justify-between">
        {/* Filter Icon */}
        <LuSettings2 className="text-gray-500 ml-2" />

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={`Search ${activeCategory ? `within ${activeCategory}` : "Here"}`}
          className="flex-grow mx-2 p-2 bg-transparent border-none outline-none placeholder-gray-400"
        />

        {/* Search Icon */}
        <div className="p-3 rounded bg-green-700">
          <FaSearch className="text-white" />
        </div>
      </div>

      {/* Auto-Suggestions */}
      {suggestions.length > 0 && !activeCategory && (
        <div className="absolute bg-white shadow-lg rounded-md w-full mt-10 max-h-40 overflow-y-auto z-[70]">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* Conditionally Render Active Filters */}
      {hasActiveFilters && (
        <div className="w-full flex flex-wrap mt-2">
          {Object.keys(activeFilters).map((filterType) => {
            const filterValue = activeFilters[filterType as keyof typeof activeFilters];
            if (filterValue) {
              return (
                <div
                  key={filterType}
                  className="bg-gray-200 p-2 rounded-md flex items-center space-x-2 ml-2"
                >
                  <span>{`${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${filterValue}`}</span>
                  <button
                    onClick={() =>
                      removeFilter(
                        filterType as
                          | "location"
                          | "level"
                          | "curriculum"
                          | "books"
                          | "study_level"
                          | "grade"
                      )
                    }
                    className="text-red-600 font-bold"
                  >
                    X
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
