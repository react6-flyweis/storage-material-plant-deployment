import React from "react";

interface CommonInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

const CommonInput: React.FC<CommonInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  inputClassName = "",
  required = false,
  disabled = false,
  name,
}) => {
  return (
    <div className={`flex flex-col gap-2  ${className}`}>
      <label className="text-sm font-medium text-[#212B36] flex items-center">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-12 px-6 bg-white border-[0.7px] border-[#D1D5DC] rounded-[11px] text-sm 
          focus:border-[#4A5565] outline-none shadow-xs transition-all 
          placeholder:text-[#919EAB] disabled:bg-gray-50 disabled:cursor-not-allowed
          ${inputClassName}`}
      />
    </div>
  );
};

export default CommonInput;
