import React from "react";

export interface LoadStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }> | null;
  color: string;
  borderL: string;
}

export const LoadStatCard: React.FC<LoadStatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  borderL,
}) => {
  return (
    <div
      className={`flex-1 bg-white p-3 md:p-5 rounded-[14px] border border-l-2 md:border-l-4 ${borderL} flex flex-col justify-between shadow-sm font-inter min-w-[180px] md:h-32 transition-all hover:shadow-md`}
    >
      <div className={color}>
        <p className="text-sm font-medium text-[#4A5565] mt-1">{title}</p>
        <div className="flex justify-between items-start mt-3">
          <p className="text-xl md:text-3xl shrink font-normal text-(--text-color-gray-5) leading-none mb-1">
            {value}
          </p>
          {Icon && <Icon className="size-6 md:size-9 shrink-0" strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
};

export default LoadStatCard;
