"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getItems } from "@/handler/Api";

// Define the type for an individual item
interface Item {
  sku: string;
  name: string;
  price: string;
  description?: string;
  visibility: boolean;
  quantity: number;
  stock_availability: boolean;
  image: string;
  subject: string;
  publisher: string;
  category: string;
  grade: string;
  study_level: string;
  curriculum: string;
  cluster: string;
  tag: string;
  discount: string;
  discounted_price: string;
}

// Define the structure for filters
interface Filters {
  category: string;
  study_level: string;
  curriculum: string;
  grade: string;
  searchTerm: string;
  location: string; // Add this
  level: string;    // Add this
  books: string;    // Add this if books is required
}


// Define the context state types
interface ItemsContextState {
  items: Item[];
  filteredItems: Item[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: Filters;
  searchTerm: string;
  autoSuggestions: string[];
  setPage: (page: number) => void;
  fetchItems: () => void;
  clearItems: () => void;
  setFilter: (filterType: keyof Filters, value: string) => void;
  clearFilters: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFilter: (filterType: keyof Filters) => void; // Add type here
  handleSuggestionClick: (suggestion: string) => void;
}

// Initial filter values
const initialFilters: Filters = {
  category: "",
  study_level: "",
  curriculum: "",
  grade: "",
  searchTerm: "",
  location: "", // Add this
  level: "",    // Add this
  books: "", 

};


const ItemsContext = createContext<ItemsContextState | undefined>(undefined);

// Define the type for the provider's props
interface ItemsProviderProps {
  children: ReactNode;
}

// Provider component
export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16); // Number of items per page
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);

  // Fetch items from the API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data: Item[] = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

// Filter the items based on the filters state and prioritize search term matches
const filterItems = () => {
  // Filter items based on selected filters (category, study_level, etc.)
  let filtered = items.filter((item) => {
    const matchesCategory = filters.category ? item.category === filters.category : true;
    const matchesStudyLevel = filters.study_level ? item.study_level === filters.study_level : true;
    const matchesCurriculum = filters.curriculum ? item.curriculum === filters.curriculum : true;
    const matchesGrade = filters.grade ? item.grade === filters.grade : true;

    // Matches search term in name or description (prioritize if the search term exists)
    const matchesSearchTerm = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    return matchesCategory && matchesStudyLevel && matchesCurriculum && matchesGrade && matchesSearchTerm;
  });

  // Sort items by relevance to search term if present (e.g., prioritize items with name match)
  if (searchTerm) {
    filtered = filtered.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Prioritize items with a search term in the name
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;

      // If both have the search term in their name or neither, do no further sorting
      return 0;
    });
  }

  setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  setFilteredItems(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
};
  // Update filters and trigger filtering
  const setFilter = (filterType: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset page to 1 when a filter is applied
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const removeFilter = (filterType: keyof Filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: "",
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setAutoSuggestions([]);
  };

  // Filter auto suggestions when searchTerm changes
  useEffect(() => {
    if (searchTerm !== "") {
      const suggestions = filteredItems
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => item.name);
      setAutoSuggestions(suggestions);
    } else {
      setAutoSuggestions([]);
    }
  }, [searchTerm, filteredItems]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    filterItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, items, searchTerm, currentPage]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        items,
        filteredItems,
        loading,
        currentPage,
        totalPages,
        totalItems: filteredItems.length,
        filters,
        searchTerm,
        autoSuggestions,
        setPage,
        fetchItems,
        clearItems: () => setItems([]),
        setFilter,
        clearFilters,
        handleSearchChange,
        removeFilter,
        handleSuggestionClick,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = (): ItemsContextState => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
