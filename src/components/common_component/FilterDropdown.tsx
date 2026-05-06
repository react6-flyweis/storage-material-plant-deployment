import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";

interface Props<T> {
  activeTab: T;
  onTabChange: (tab: T) => void;
  options: { label: string; value: T }[];
}

const FilterDropdown = <T extends string>({ activeTab, onTabChange, options }: Props<T>) => {
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
        className="flex bg-white items-center gap-2 border border-[#DBEAFE] rounded-lg px-4 py-2 text-sm font-medium text-[#212B36] min-w-[140px] justify-between hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#637381]" />
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 text-[#637381] ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[#DBEAFE] rounded-lg shadow-sm z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onTabChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${
                activeTab === option.value ? "text-blue-600 font-normal bg-blue-50/50" : "text-[#212B36] font-medium"
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
