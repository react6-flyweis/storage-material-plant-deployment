import React from "react";

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  showDivider?: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  subtitle,
  iconBgColor = "bg-[#F4F6F8]",
  iconColor = "text-[#637381]",
  className = "",
  showDivider = true,
}) => {
  return (
    <div
      className={`${
        showDivider ? "pb-6 border-b border-gray-100" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`md:w-12 w-10 md:h-12 h-10 ${iconBgColor} rounded-full flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-base md:text-xl font-inter font-bold text-[#212B36]">
            {title}
          </h3>
          <p className="text-sm text-[#637381]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
