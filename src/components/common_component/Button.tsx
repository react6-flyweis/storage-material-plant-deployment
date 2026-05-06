import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "gradient" | "outline" | "danger" | "white" | "purpleFilled";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const baseStyles =
  "font-inter font-bold transition-all duration-200 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1E51A4] text-white hover:opacity-90 shadow-lg shadow-blue-500/20",

  secondary:
    "bg-white border-2 border-[#446DF6] text-[#212B36] hover:bg-gray-50 shadow-sm",

  gradient:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20",

  outline:
    "border border-gray-200 text-[#637381] hover:bg-gray-50",

  danger:
    "bg-red-500 text-white hover:opacity-90",

  white:
    "bg-white text-black hover:bg-gray-50 border border-[#E2E4E6] rounded-sm shadow-xs font-semibold",
    
  purpleFilled:
    "bg-[#7539FF] text-white hover:opacity-90 border border-[#E2E4E6] rounded-sm shadow-xs font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3 text-base",
  xl: "px-8 py-4 text-lg",
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