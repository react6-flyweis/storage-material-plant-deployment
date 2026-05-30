import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const AccordionSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100  mb-4">
      <button
        className="w-full flex items-center justify-between p-4 md:p-5 bg-white hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex items-center gap-3">
          <Info className="text-emerald-500 w-5 h-5" />
          <span className="font-semibold text-gray-800 text-sm md:text-base">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 md:p-5 border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;
