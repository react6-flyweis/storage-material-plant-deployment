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
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";
import SuccessModal from "../common_component/SuccessModal";


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
      <div className="text-(--text-color-gray-3) text-sm">{item.equipment}</div>
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

const upcomingScheduleByFilter: Record<TabType, UpcomingSchedule[]> = {
  today: mockBreakdownCases.slice(0, 3),
  week: mockBreakdownCases.slice(0, 5),
  month: mockBreakdownCases,
};

const equipmentStatsByFilter: Record<
  TabType,
  {
    title: string;
    value: string;
    icon: any;
    color: string;
  }[]
> = {
  today: [
    {
      title: "Total Equipment Under Maintenance:",
      value: "3",
      icon: <img src={HammerIcon} className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "2",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "1",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-4" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "0",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],

  week: [
    {
      title: "Total Equipment Under Maintenance:",
      value: "6",
      icon: <img src={HammerIcon} className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "4",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "3",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-4" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "1",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],

  month: [
    {
      title: "Total Equipment Under Maintenance:",
      value: "12",
      icon: <img src={HammerIcon} className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "42",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "74",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-4" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "12",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const UpcomingScheduleView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] =
    useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const data = upcomingScheduleByFilter[activeTab];
  const stats = equipmentStatsByFilter[activeTab];

  const openReportModal = () => setIsReportModalOpen(true);
  const openLogModal = () => setIsLogModalOpen(true);
  const openServiceProviderModal = () => setIsServiceProviderModalOpen(true);
  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Report Breakdown Added Successfully");
  };
  const closeLogModal = () => {
    setIsLogModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Log Maintenance Added Successfully");
  };
  const closeServiceProviderModal = () => {
    setIsServiceProviderModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Service Provider Added Successfully");
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

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
        title="Upcoming Maintenance Table"
        columns={upcomingScheduleColumns}
        data={data}
        pagination={true}
        actions={<TableActionButtons />}
      />

      <AddServiceProviderModal
        isOpen={isServiceProviderModalOpen}
        onClose={closeServiceProviderModal}
        onSubmit={closeServiceProviderModal}
      />
      <ReportBreakdownModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={closeReportModal}
      />
      <LogMaintenanceModal isOpen={isLogModalOpen} onClose={closeLogModal}
        onSubmit={closeLogModal}
       />
       <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default UpcomingScheduleView;
