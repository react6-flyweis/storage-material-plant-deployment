import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "gradient" | "outline" | "danger" | "white" | "purpleFilled" | "greenFilled" | "blueFilled" | "grayFilled" | "mint";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const baseStyles =
  "font-inter w-fit font-medium transition-all duration-200 rounded-[8px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1E51A4] text-white hover:opacity-90 shadow-xs shadow-blue-500/20",

  secondary:
    "bg-white border border-[#446DF6] text-[#446DF6] rounded-lg text-sm font-inter font-bold hover:bg-[#446DF6]/5 transition-colors",

  gradient:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-xs shadow-blue-500/20 ",

  outline:
    "border border-gray-200 text-[#D1D5DC] hover:bg-gray-50 text-black",

  danger:
    "bg-red-500 text-white hover:opacity-90 ",

  white:
    "bg-white text-black hover:bg-gray-50 border border-[#E2E4E6]  shadow-xs font-medium",
    
  purpleFilled:
    "bg-[#7539FF] text-white hover:opacity-90 border border-[#E2E4E6]  shadow-xs font-medium",

  greenFilled: "bg-[#3AB449] text-white hover:opacity-90 border border-[#E2E4E6]  shadow-xs font-medium",

  blueFilled: "bg-[#2563EB] text-white hover:opacity-90 border border-[#E2E4E6]  shadow-xs font-medium",
  grayFilled: "bg-[#5D6772] text-white border border-[#E2E4E6]  shadow-xs font-medium",
  mint:"bg-[#00C8B3] text-black border border-[#FCF8EB] font-medium",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 md:text-sm text-xs",
  md: "px-6 py-3 md:text-sm text-xs",
  lg: "px-8 py-3 md:text-base text-sm",
  xl: "px-8 py-4 md:text-lg text-sm",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;