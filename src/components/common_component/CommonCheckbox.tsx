import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommonCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?:boolean; 
  size?:"xs"| "sm" | "md" | "lg";
}

const CommonCheckbox: React.FC<CommonCheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled,
  size = "md"
}) => {
const sizeClass =
  size === "sm" ? "h-[16px] w-[16px] rounded-[4px]" :
  size === "md" ? "size-6 rounded-[8px]" :
  size === "xs" ? "h-[16px] w-[16px] rounded-[5px]" :
  "size-8 rounded-[8px]";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "flex items-center justify-center transition-all duration-200 border-2",
        checked
          ? "bg-[#7047FF] border-[#7047FF]"
          : "bg-white border-[#E2E4E6] hover:border-[#7047FF]/50",
        className,
        sizeClass,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {checked && (
        <Check
          className="text-white animate-in zoom-in-50 duration-200"
          size={16}
          strokeWidth={3.5}
        />
      )}
    </button>
  );
};

export default CommonCheckbox;
