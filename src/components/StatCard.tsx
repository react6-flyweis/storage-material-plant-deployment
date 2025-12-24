import React from "react";

interface StatCardProps {
  title: string;
  count: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, bgColor }) => {
  return (
    <div
      className={`${bgColor} rounded-lg md:p-5 p-2 text-white flex justify-between items-center shadow-md min-h-[120px]`}
    >
      <div className="flex flex-col justify-center h-full">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <span className="md:text-2xl font-normal mt-2">{count}</span>
      </div>
      <div className="bg-white p-3 rounded-lg backdrop-blur-sm">{icon}</div>
    </div>
  );
};

export default StatCard;
