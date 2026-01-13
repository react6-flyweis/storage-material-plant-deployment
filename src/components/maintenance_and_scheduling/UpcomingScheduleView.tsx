import { useState } from "react";
import Table, { type Column } from "../Table";
import { mockBreakdownCases } from "../../data/mockData";

import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import AddServiceProviderModal from "./AddServiceProviderModal";
import TableActionButtons from "../common_component/TableActionButtons";

export type UpcomingSchedule = {
  id: number;
  equipment: string;
  reportedOn: string;
  issue: string;
  severity: string;
  severityColor: string;
  status: string;
  assignedTo: string;
};

export const upcomingScheduleColumns: Column<UpcomingSchedule>[] = [
  {
    header: "Equipment",
    accessor: (item) => (
      <div className="text-[#6B7280] text-sm">{item.equipment}</div>
    ),
  },
  {
    header: "Type",
    accessor: (item) => <div className="text-sm">{item.reportedOn}</div>,
  },
  {
    header: "Last Service",
    accessor: (item) => <div className="text-sm">{item.issue}</div>,
  },
  {
    header: "Next Due",
    accessor: (item) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${item.severityColor}`}></div>
        <span className="text-sm">{item.severity}</span>
      </div>
    ),
  },
  {
    header: "Priority",
    accessor: (item) => <div className="text-sm">{item.status}</div>,
  },
  {
    header: "Vendor",
    accessor: (item) => <div className="text-sm">{item.assignedTo}</div>,
  },
  {
    header: "Action",
    accessor: (item) =>
      item.status === "Pending" ? (
        <button className="px-4 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors">
          Log Now
        </button>
      ) : (
        <button className="px-4 py-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
          View
        </button>
      ),
  },
];

export const equipmentStats = [
  {
    title: "Total Equipment Under Maintenance:",
    value: "12",
    icon: (
      <img
        src={HammerIcon}
        alt="total-maintenance"
        className="md:size-7 size-5"
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
        className="md:size-7 size-5"
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
        className="md:size-7 size-5"
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
        className="md:size-7 size-5"
      />
    ),
    color: "bg-[#FD8D5B]",
  },
];
const UpcomingScheduleView = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] =
    useState(false);

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const openLogModal = () => {
    setIsLogModalOpen(true);
  };

  const openServiceProviderModal = () => {
    setIsServiceProviderModalOpen(true);
  };

  const closeServiceProviderModal = () => {
    setIsServiceProviderModalOpen(false);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const closeLogModal = () => {
    setIsLogModalOpen(false);
  };

  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Upcoming Schedule"
          subtitle="Here’s a summary of your ongoing steel building projects."
        />
        <div className="flex  xl:mt-2 mt-5 flex-wrap lg:gap-2 gap-1 justify-end ml-auto">
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
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-no rmal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
        {equipmentStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      <Table
        title="Upcoming Maintenance Table"
        columns={upcomingScheduleColumns}
        data={mockBreakdownCases}
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

export default UpcomingScheduleView;
