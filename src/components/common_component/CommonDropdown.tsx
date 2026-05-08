import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CommonDropdownProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-inter font-normal text-black">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F8F9] border border-[#E2E4E6] rounded-sm text-left focus:outline-none focus:ring focus:ring-blue-500/20 transition-all"
        >
          <span
            className={`text-sm md:text-base font-inter ${selectedOption ? "text-black" : "text-gray-400"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm md:text-base font-inter hover:bg-gray-50 transition-colors ${
                    value === option.value
                      ? "bg-gray-50 text-blue-600 font-semibold"
                      : "text-[#637381]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonDropdown;
