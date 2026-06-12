import React from "react";
import { Search } from "lucide-react";
import Button from "./Button";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onFilterClick: () => void;
  className?: string;
  isFilterApplied?: boolean;
  onClearFilters?: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  onFilterClick,
  className = "",
  isFilterApplied = false,
  onClearFilters,
}) => {
  return (
    <div className={`bg-white p-3 rounded-[14px] flex flex-col md:flex-row gap-3 items-center border border-gray-50 ${className}`}>
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md w-full pl-12 pr-4 py-3.5 bg-[#F4F6F8] border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end">
        {isFilterApplied && onClearFilters && (
          <Button variant="white" onClick={onClearFilters}>
            Clear
          </Button>
        )}
        <Button variant="gradient" onClick={onFilterClick}>
          Filter
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
