import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-500",
}) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-medium text-gray-800">{value}</h3>
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex justify-between items-center mt-4 text-xs font-medium">
          <span
            className={trend.isPositive ? "text-green-500" : "text-red-500"}
          >
            {trend.value}{" "}
            <span className="text-black-400 font-normal">vs Last Month</span>
          </span>
          <button className="text-black-400 underline hover:text-gray-600">
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default KPICard;
