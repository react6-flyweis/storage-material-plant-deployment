import { useState, useRef, useEffect } from "react";
import { ListFilter, ChevronDown } from "lucide-react";

interface Props<T> {
  activeTab: T;
  onTabChange: (tab: T) => void;
  options: { label: string; value: T }[];
  label?: string;
  icon?: React.ReactNode;
}

const FilterDropdown = <T extends string>({ 
  activeTab, 
  onTabChange, 
  options, 
  label, 
  icon 
}: Props<T>) => {
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
        className="flex bg-white items-center gap-2 border border-[#E2E4E6] rounded-lg px-4 py-2 text-sm font-medium text-[#212B36] hover:bg-gray-50 transition-colors shadow-xs"
      >
        <div className="flex items-center gap-2">
          {icon || <ListFilter size={18} className="text-[#637381]" />}
          <div className="flex items-center gap-1">
            {label && <span className="text-[#212B36]">{label}</span>}
            <span className="text-[#212B36] font-bold">{selectedLabel}</span>
          </div>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 text-[#212B36] ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-white border border-[#E2E4E6] rounded-lg shadow-lg z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onTabChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                activeTab === option.value ? "text-[#1E51A4] font-semibold bg-gray-50" : "text-[#212B36] font-medium"
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
