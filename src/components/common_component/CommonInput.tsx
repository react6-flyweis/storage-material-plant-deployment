import React, { forwardRef } from "react";

interface CommonInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
}

const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  (
    {
      label,
      className = "",
      inputClassName = "",
      required = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
      // If a native onChange was provided in props (unlikely since we omitted it), call it too
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props?.onChange?.(e);
    };

    return (
      <div className={`flex flex-col gap-2  ${className}`}>
        <label className="text-sm font-medium text-[#212B36] flex items-center">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          {...props}
          onChange={handleChange}
          className={`w-full h-12 px-6 bg-white border-[0.7px] border-[#D1D5DC] rounded-[11px] text-sm 
          focus:border-[#4A5565] outline-none shadow-xs transition-all 
          placeholder:text-[#919EAB] disabled:bg-gray-50 disabled:cursor-not-allowed
          ${inputClassName}`}
        />
      </div>
    );
  },
);

CommonInput.displayName = "CommonInput";

export default CommonInput;
