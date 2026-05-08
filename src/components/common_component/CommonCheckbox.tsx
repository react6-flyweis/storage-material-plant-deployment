import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommonCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const CommonCheckbox: React.FC<CommonCheckboxProps> = ({
  checked,
  onChange,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "size-6 rounded-[8px] flex items-center justify-center transition-all duration-200 border-2",
        checked
          ? "bg-[#7047FF] border-[#7047FF]"
          : "bg-white border-[#E2E4E6] hover:border-[#7047FF]/50",
        className
      )}
    >
      {checked && (
        <Check className="text-white animate-in zoom-in-50 duration-200" size={16} strokeWidth={3.5} />
      )}
    </button>
  );
};

export default CommonCheckbox;
