import React from "react";
import Table, { type Column } from "../Table";
import { usage_tracking_data } from "./mockData";
import CreateTransferReqModal from "./CreateTransferReqModal";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import AssignEquipmentModal from "./AssignEquipmentModal";
import { FileX, Funnel } from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";

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

  const columns: Column<(typeof usage_tracking_data)[0]>[] = [
    {
      header: "Date",
      accessor: (row) => <span className="text-gray-500">{row.date}</span>,
    },
    {
      header: "Equipment",
      accessor: (row) => (
        <span className="text-gray-500 font-medium block max-w-[150px]">
          {row.equipment}
        </span>
      ),
    },
    {
      header: "Operator",
      accessor: (row) => (
        <span className="text-black font-normal">{row.operator}</span>
      ),
    },
    {
      header: "Site",
      accessor: (row) => (
        <span className="text-black font-normal">{row.site}</span>
      ),
    },
    {
      header: "Hours",
      accessor: (row) => (
        <span className="text-black font-normal">{row.hours}</span>
      ),
    },
    {
      header: "Fuel",
      accessor: (row) => (
        <span className="text-black font-normal">{row.fuel}</span>
      ),
    },
    {
      header: "Notes",
      accessor: (row) => (
        <span className="text-black font-normal">{row.notes}</span>
      ),
      cellClassName: "max-w-[80px]",
    },
    {
      header: "Action",
      accessor: () => {
        return (
          <button className="bg-[#EAB30826] text-[#EAB308] px-3 py-1.5 rounded-full text-xs font-normal ">
            View
          </button>
        );
      },
      className: "text-center",
      cellClassName: "text-center",
    },
  ];

  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
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
        title="USAGE LOG"
        columns={columns}
        data={usage_tracking_data}
        pagination={true}
        actions={<TableActionButtons />}
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
