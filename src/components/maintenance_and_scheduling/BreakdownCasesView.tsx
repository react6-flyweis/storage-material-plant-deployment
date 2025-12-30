import Table, { type Column } from "../Table";
import { mockBreakdownCases } from "../../data/mockData";
import { useState } from "react";
import { equipmentStats } from "./UpcomingScheduleView";
import StatCard from "@/components/ui/stat-card";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import { FilePlus, FunnelIcon } from "lucide-react";

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

const BreakdownCasesView = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const openLogModal = () => {
    setIsLogModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const closeLogModal = () => {
    setIsLogModalOpen(false);
  };
  return (
    <div className="md:pr-5 pt-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <div className="">
          <h1 className="md:text-2xl text-lg font-normal text-gray-800 mb-2">
            Breakdown cases
          </h1>
          <p className="text-(--text-color-gray-2) text-sm">
            Here’s a summary of your ongoing steel building projects.
          </p>
        </div>
        <div className="flex  mt-2 lg:flex-row gap-1 flex-wrap justify-end ml-auto">
          <button className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs">
            <span className="md:text-lg leading-none">+</span> Add Service
            Provider
          </button>

          <button
            onClick={openReportModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            text-xs
          >
            <span className="md:text-lg leading-none">+</span>
            Report Breakdown
          </button>

          <button
            onClick={openLogModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            text-xs
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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
        title="Breakdown Table"
        columns={breakdownColumns}
        data={mockBreakdownCases}
        pagination={true}
        actions={
          <div className="flex gap-2 flex-wrap ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
              <FunnelIcon className="w-4 h-4" />
              Filter Equipment
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs  hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white rounded-lg md:text-sm text-xs  hover:bg-blue-700 transition-colors">
              <FilePlus className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        }
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
