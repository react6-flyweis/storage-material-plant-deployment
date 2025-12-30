import { useState } from "react";
import Table, { type Column } from "../Table";
import { equipmentData } from "./mockData";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import CreateTransferReqModal from "./CreateTransferReqModal";
import { FilePlus, FileX, FunnelIcon } from "lucide-react";
import AssignEquipmentModal from "./AssignEquipmentModal";

export const equipmentStats = [
  {
    title: "Total Equipment",
    value: "12 units",
    icon: (
      <img
        src={HammerIcon}
        alt="total-maintenance"
        className="md:size-7 size-5 p-[2px] "
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
        className="md:size-7 size-5 p-[2px]"
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
        className="md:size-7 size-4 p-1"
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
        className="md:size-7 size-5 p-[2px]"
      />
    ),
    color: "bg-[#FD8D5B]",
  },
];

const EquipmentAllocationView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Equipment ID",
      accessor: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Name",
      accessor: (row) => (
        <span className="text-gray-800 font-medium block max-w-[150px]">
          {row.name}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${row.dotColor}`}></div>
          <span className={`font-medium ${row.statusColor} text-xs`}>
            {row.status}
          </span>
        </div>
      ),
    },
    {
      header: "Project",
      accessor: (row) => <span className="text-gray-800">{row.project}</span>,
    },
    {
      header: "Location",
      accessor: (row) => <span className="text-gray-800">{row.location}</span>,
    },
    {
      header: "Hours",
      accessor: (row) => <span className="text-gray-800">{row.hours}</span>,
    },
    {
      header: "Next Due",
      accessor: (row) => (
        <span
          className={`font-medium ${
            row.nextDue === "Overdue" ? "text-red-600" : "text-gray-800"
          }`}
        >
          {row.nextDue}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (row) => {
        if (row.status === "In Use") {
          return (
            <button className="bg-[#E6FFFA] text-[#0D9488] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-teal-100 transition-colors">
              View / Transfer
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
    <div className="sm:pr-5 sm:pt-5 pt-2 space-y-5">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <div className="mb-3">
          <h1 className="md:text-2xl text-xl font-normal text-gray-800 mb-2">
            Equipment Allocation
          </h1>
          <p className="text-(--text-color-gray-2) text-sm">
            Here’s a summary of your ongoing steel building projects.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap ml-auto">
          <button
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <span className="text-lg leading-none">+</span> Create Transfer
            Request
          </button>

          <button
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
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
        title="EQUIPMENT LIST"
        columns={columns}
        data={equipmentData}
        pagination={true}
        actions={
          <div className="flex flex-wrap ml-auto gap-2">
            <button className="flex ml-auto items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
              <FunnelIcon className="w-4 h-4" />
              Filter Equipment
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <FileX className="w-4 h-4" />
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg text-sm hover:opacity-80">
              <FilePlus className="w-4 h-4" />
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

export default EquipmentAllocationView;
