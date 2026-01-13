import Table, { type Column } from "../Table";
import { mockBreakdownCases } from "../../data/mockData";
import { useState } from "react";
import StatCard from "@/components/ui/stat-card";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import AddServiceProviderModal from "./AddServiceProviderModal";
import TableActionButtons from "../common_component/TableActionButtons";
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";

export type BreakdownCase = {
  id: number;
  equipment: string;
  reportedOn: string;
  issue: string;
  severity: string;
  severityColor: string;
  status: string;
  assignedTo: string;
};

const equipmentStats = [
  {
    title: "Total Equipment Under Maintenance:",
    value: "12",
    icon: (
      <img
        src={HammerIcon}
        alt="total-maintenance"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#1D51A4]",
  },
  {
    title: "Breakdown Cases:",
    value: "42",
    icon: (
      <img
        src={CheckedShieldIcon}
        alt="breakdown"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#3AB449]",
  },
  {
    title: "Maintenance Due This Week:",
    value: "74",
    icon: (
      <img
        src={YellowDollerIcon}
        alt="due-maintenance"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#F59E0B]",
  },
  {
    title: "Overdue Maintenance:",
    value: "12",
    icon: (
      <img
        src={SalmonGraphIcon}
        alt="under-maintenance"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#FD8D5B]",
  },
];

export const breakdownColumns: Column<BreakdownCase>[] = [
  {
    header: "Equipment",
    accessor: (item) => (
      <div className="text-gray-600 text-sm">{item.equipment}</div>
    ),
  },
  {
    header: "Reported On",
    accessor: (item) => <div className="text-sm">{item.reportedOn}</div>,
  },
  {
    header: "Issue",
    accessor: (item) => <div className="text-sm">{item.issue}</div>,
  },
  {
    header: "Severity",
    accessor: (item) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${item.severityColor}`}></div>
        <span className="text-sm">{item.severity}</span>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: (item) => <div className="text-sm">{item.status}</div>,
  },
  {
    header: "Assigned To",
    accessor: (item) => <div className="text-sm">{item.assignedTo}</div>,
  },
  {
    header: "Action",
    accessor: (item) =>
      item.status === "Pending" ? (
        <button className="px-4 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full md:text-xs text-[12px] font-medium hover:bg-yellow-200 transition-colors">
          Assign
        </button>
      ) : (
        <button className="px-4 py-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full md:text-xs text-[12px] font-medium hover:bg-green-200 transition-colors">
          View
        </button>
      ),
  },
];

const breakdownCasesByFilter: Record<TabType, BreakdownCase[]> = {
  today: mockBreakdownCases.slice(0, 3),
  week: mockBreakdownCases.slice(0, 6),
  month: mockBreakdownCases,
};

const equipmentStatsByFilter: Record<TabType, typeof equipmentStats> = {
  today: equipmentStats.map((s, i) => ({
    ...s,
    value: ["3", "5", "7", "1"][i] ?? s.value,
  })),

  week: equipmentStats.map((s, i) => ({
    ...s,
    value: ["8", "14", "19", "4"][i] ?? s.value,
  })),

  month: equipmentStats,
};

const BreakdownCasesView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] =
    useState(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const openLogModal = () => setIsLogModalOpen(true);
  const openServiceProviderModal = () => setIsServiceProviderModalOpen(true);

  const closeReportModal = () => setIsReportModalOpen(false);
  const closeLogModal = () => setIsLogModalOpen(false);
  const closeServiceProviderModal = () => setIsServiceProviderModalOpen(false);

  const tableData = breakdownCasesByFilter[activeTab];
  const stats = equipmentStatsByFilter[activeTab];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Breakdown cases"
          subtitle="Here’s a summary of your ongoing steel building projects."
        />
        <div className="flex  xl:mt-2 mt-5 lg:flex-row lg:gap-2 gap-1 flex-wrap justify-end ml-auto">
          <button
            onClick={openServiceProviderModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span> Add Service
            Provider
          </button>

          <button
            onClick={openReportModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>
            Report Breakdown
          </button>

          <button
            onClick={openLogModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Table */}
      <Table
        title="Breakdown Table"
        columns={breakdownColumns}
        data={tableData}
        pagination={true}
        actions={<TableActionButtons />}
      />

      <AddServiceProviderModal
        isOpen={isServiceProviderModalOpen}
        onClose={closeServiceProviderModal}
      />
      <ReportBreakdownModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
      />
      <LogMaintenanceModal isOpen={isLogModalOpen} onClose={closeLogModal} />
    </div>
  );
};

export default BreakdownCasesView;
