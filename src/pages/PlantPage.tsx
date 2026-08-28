import { useState } from "react";
import { RefreshCw } from "lucide-react";
import TitleSubtitle from "@/components/common_component/TitleSubtitle";
import { dashboardText } from "@/data/text/DashboardText";
import ProductionOverview from "@/components/ProductionOverview";
import PlantDataGrids from "@/components/PlantDataGrids";
import RecentShipperFilesTable from "@/components/RecentShipperFilesTable";
import DrawingApprovalStatusTable from "@/components/DrawingApprovalStatusTable";
import SubHeading from "@/components/common_component/SubHeading";
import PageWrapper from "@/components/common_component/PageWrapper";
import PlantStatsCards from "@/components/plantDashboard/PlantStatsCards";

import { useGetPlantDashboardQuery } from "@/redux/api/plantDashboardApi";

export interface ProductionMetric {
  label: string;
  value: string;
  icon: "graph" | "moneybillnote" | "moneybag" | "truck" | "chart";
}

export type TabType = "today" | "week" | "month";

const filterLabels: Record<TabType, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

const PlantPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");

  const {
    data: dashboardData,
    isLoading,
    isFetching,
    refetch,
  } = useGetPlantDashboardQuery();

  const productionOverview = dashboardData?.productionOverviewToday;

  const formatPct = (val?: number | string | null): string => {
    if (val === undefined || val === null || val === "") return "-";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return String(val);
    return `${num}%`;
  };

  const formatTonnage = (val?: number | string | null): string => {
    if (val === undefined || val === null || val === "") return "-";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return `${val} MT`;
    return `${num.toLocaleString("en-US", { maximumFractionDigits: 2 })} MT`;
  };

  const productionMetrics: ProductionMetric[] = [
    {
      label: "Planned Tonnage",
      value: formatTonnage(productionOverview?.plannedTonnage),
      icon: "graph",
    },
    {
      label: "Produced Tonnage",
      value: formatTonnage(productionOverview?.producedTonnage),
      icon: "moneybillnote",
    },
    {
      label: "Utilization",
      value: formatPct(productionOverview?.utilizationPct ?? productionOverview?.utilization),
      icon: "moneybag",
    },
    {
      label: "On-Time Delivery",
      value: formatPct(productionOverview?.onTimeDeliveryPct ?? productionOverview?.onTimeDelivery),
      icon: "moneybag",
    },
    {
      label: "Rework/Rejection",
      value: formatPct(productionOverview?.reworkRejectionPct ?? productionOverview?.reworkRejection),
      icon: "graph",
    },
  ];

  return (
    <PageWrapper>
      {/* Header: Title + Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TitleSubtitle
          title={dashboardText.header.title}
          subtitle={dashboardText.header.subtitle}
        />
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#155DFC] bg-white border border-gray-200 rounded-lg hover:border-[#155DFC]/40 transition-colors shadow-xs"
          title="Refresh dashboard data"
        >
          <RefreshCw
            size={16}
            className={`${isFetching ? "animate-spin text-[#155DFC]" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <PlantStatsCards
        stats={dashboardData?.stats}
        isLoading={isLoading}
      />

      {/* Production Overview */}
      <ProductionOverview
        metrics={productionMetrics}
        filterLabel={filterLabels[activeTab]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Dashboard Grids */}
      <PlantDataGrids
        shipperFiles={dashboardData?.recentShipperFiles}
        alerts={dashboardData?.plantAlerts}
        carriers={dashboardData?.freightCarriers}
        isLoading={isLoading}
      />

      {/* Recent Shipper Files Table */}
      <div className="space-y-4">
        <SubHeading text="Recent Shipper Files" />
        <RecentShipperFilesTable
          data={dashboardData?.recentShipperFiles ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Drawing Approval Status Table */}
      <div className="space-y-4">
        <SubHeading text="Drawing Approval Status" />
        <DrawingApprovalStatusTable
          data={dashboardData?.drawingApprovalStatus ?? []}
          isLoading={isLoading}
        />
      </div>
    </PageWrapper>
  );
};

export default PlantPage;
