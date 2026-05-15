import React from "react";
import { CircleCheck} from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "green" | "yellow" | "red" | "gray" | "blue" | "cyan" | "gradient";

interface CommonStatusBadgeProps {
  text: string;
  variant: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const CommonStatusBadge: React.FC<CommonStatusBadgeProps> = ({
  text,
  variant,
  icon,
  className,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    yellow: "bg-(--yellow) text-(--text-color-yellow) border-(--yellow-border)",
    green: "bg-(--light-green) text-(--text-color-green-3) border-(--light-green-border)",
    red: "bg-[#FEE2E2] text-[#EF4444] border-[#FEE2E2]",
    cyan: "bg-[#E6FFFA] text-[#047857] border-[#E6FFFA]",
    gray: "bg-[#F3F4F6] text-[#6B7280] border-[#F3F4F6]",
    blue: "bg-[#E0F2FE] text-[#0369A1] border-[#E0F2FE]",
    gradient:"bg-[#F4F8FE] text-[#2563EB] border-[#E9F4FD]",
  };

  const getAutoIcon = (v: BadgeVariant, t: string) => {
    if (!t) return null;
    const s = t.toLowerCase();
    if (v === "green") return <CircleCheck size={14} />;
    if (s.includes("locked")) return <CircleCheck size={12} />;
    return null;
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-sm text-xs font-inter font-medium inline-flex items-center gap-1.5 whitespace-nowrap border transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {text}
      {icon || getAutoIcon(variant, text)}
    </span>
  );
};

export default CommonStatusBadge;
