import React from "react";
import Table, { type Column } from "../Table";
import { equipmentData } from "./mockData";
import CreateTransferReqModal from "./CreateTransferReqModal";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import AssignEquipmentModal from "./AssignEquipmentModal";
import { FileX, Funnel } from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";

export const equipmentStats = [
  {
    title: "Total Equipment:",
    value: "12 units",
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
    title: "Allocated to Sites:",
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
    title: "Available at Yard:",
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
    title: "Under Transfer:",
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

const UsageTrackingView = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Date",
      accessor: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Equipment",
      accessor: (row) => (
        <span className="text-gray-500 font-medium block max-w-[150px]">
          {row.name}
        </span>
      ),
    },
    {
      header: "Operator",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Site",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Hours",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "fuel",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Notes",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Action",
      accessor: (row) => {
        if (row.status === "In Use") {
          return (
            <button className="bg-[#FFFBEB] text-[#D97706] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-teal-100 transition-colors">
              View
            </button>
          );
        } else if (row.status === "Breakdown") {
          return (
            <button className="bg-[#FFFBEB] text-[#D97706] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-yellow-100 transition-colors">
              Log Issue
            </button>
          );
        } else {
          return (
            <button className="bg-[#DBEAFE] text-[#2563EB] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors">
              Maintenance
            </button>
          );
        }
      },
      className: "text-right",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="xl:px-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <TitleSubtitle
          title="Usage Tracking"
          subtitle="Track, assign, transfer, and monitor equipment across all construction sites and the central yard."
        />
        <div className="flex gap-3 flex-wrap ml-auto">
          <button
            className=" sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <span className="text-lg leading-none">+</span> Create Transfer
            Request
          </button>

          <button
            className=" sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-lg leading-none">+</span>Assign Equipment
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
        title="USAGE LOG"
        columns={columns}
        data={equipmentData}
        pagination={true}
        actions={
          <div className="flex gap-2 flex-wrap mt-3 justify-end ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs  hover:bg-gray-50">
              <Funnel className="w-3 h-3" />
              Filter Equipment
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
              <FileX className="w-4 h-4" />
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg md:text-sm text-xs hover:opacity-80">
              Export PDF
            </button>
          </div>
        }
      />
      <CreateTransferReqModal
        isOpen={isTransferModalOpen}
        onClose={closeTransferModal}
      />
      <AssignEquipmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default UsageTrackingView;
