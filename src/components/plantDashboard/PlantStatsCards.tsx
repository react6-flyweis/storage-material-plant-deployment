import React from "react";
import HammerIcon from "@/assets/hammerIcon.svg";
import CheckedShieldIcon from "@/assets/checkedShieldIcon.svg";
import YellowDollerIcon from "@/assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "@/assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import type { PlantDashboardStats } from "@/redux/api/plantDashboardApi";

interface PlantStatsCardsProps {
  stats?: PlantDashboardStats;
  isLoading?: boolean;
}

const icons = [
  {
    icon: <img src={HammerIcon} alt="total projects" className="md:size-6 size-4" />,
    color: "bg-[#3B82F6]",
  },
  {
    icon: <img src={CheckedShieldIcon} alt="in production" className="md:size-6 size-4" />,
    color: "bg-[#3AB449]",
  },
  {
    icon: <img src={YellowDollerIcon} alt="ready to dispatch" className="md:size-6 size-4" />,
    color: "bg-[#F59E0B]",
  },
  {
    icon: <img src={SalmonGraphIcon} alt="dispatched today" className="md:size-6 size-4" />,
    color: "bg-[#6840D4]",
  },
  {
    icon: <img src={SalmonGraphIcon} alt="pending approval" className="md:size-6 size-4" />,
    color: "bg-[#FD8D5B]",
  },
];

const formatStatValue = (val?: number): string => {
  if (val === undefined || val === null) return "00";
  if (val >= 0 && val < 10) return `0${val}`;
  return Number(val).toLocaleString();
};

export const PlantStatsCards: React.FC<PlantStatsCardsProps> = ({ stats, isLoading }) => {
  const statItems = [
    { title: "Total Projects", value: formatStatValue(stats?.totalProjects) },
    { title: "In Production", value: formatStatValue(stats?.inProduction) },
    { title: "Ready to Dispatch", value: formatStatValue(stats?.readyToDispatch) },
    { title: "Dispatched Today", value: formatStatValue(stats?.dispatchedToday) },
    { title: "Pending Approval", value: formatStatValue(stats?.pendingApproval) },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {statItems.map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm animate-pulse flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {statItems.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={icons[index]?.icon}
          color={icons[index]?.color}
        />
      ))}
    </div>
  );
};

export default PlantStatsCards;
