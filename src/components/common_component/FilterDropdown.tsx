import React, { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import type { TabType } from "@/pages/PlantPage";

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  options: { label: string; value: TabType }[];
}

const FilterDropdown: React.FC<Props> = ({ activeTab, onTabChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === activeTab)?.label || "Select";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex bg-white items-center gap-2 border border-[#DBEAFE] rounded-lg px-3 py-1.5 text-sm text-[#212B36] w-fit hover:bg-gray-50 transition-colors"
      >
        <Filter size={16} />
        {selectedLabel}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-[#DBEAFE] rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onTabChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F9FAFB] transition-colors ${
                activeTab === option.value ? "text-blue-600 font-medium bg-blue-50" : "text-[#212B36]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
