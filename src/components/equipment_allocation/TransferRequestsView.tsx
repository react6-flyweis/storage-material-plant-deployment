import { useState } from "react";
import Table, { type Column } from "../Table";
import { equipmentData } from "./mockData";
import StatCard from "@/components/ui/stat-card";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import { FilePlus, FileX, FunnelIcon } from "lucide-react";
import AssignEquipmentModal from "./AssignEquipmentModal";
import CreateTransferReqModal from "./CreateTransferReqModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";

export const equipmentStats = [
  {
    title: "Pending Requests:",
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
    title: "Approved:",
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
    title: "In Transit:",
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
];

const TransferRequestsView = () => {
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
      header: "Req ID",
      accessor: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Equipment",
      accessor: (row) => (
        <span className="text-gray-500 font-normal block max-w-[150px]">
          {row.name}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="text-gray-700 font-normal">{row.category}</span>
      ),
    },
    {
      header: "From",
      accessor: (row) => (
        <span className="text-gray-700 font-normal">{row.category}</span>
      ),
    },
    {
      header: "To",
      accessor: (row) => (
        <span className="text-gray-700 font-normal">{row.category}</span>
      ),
    },
    {
      header: "Requested By",
      accessor: (row) => (
        <span className="text-gray-700 font-normal">{row.category}</span>
      ),
    },
    {
      header: "Priority",
      accessor: () => (
        <span className="text-gray-700 font-normal">{"🟡 Medium"}</span>
      ),
    },
    {
      header: "Status",
      accessor: () => (
        <div className="flex items-center gap-2">
          <span className={`font-normal text-sm`}>{"Pending"}</span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (row) => {
        if (row.status === "In Use") {
          return (
            <div className="flex justify-around gap-2">
              <button className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-regular  transition-colors">
                Approved
              </button>
              <button className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-regular  transition-colors">
                Rejected
              </button>
            </div>
          );
        } else if (row.status === "Breakdown") {
          return (
            <div className="flex justify-around gap-2">
              <button className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-regular  transition-colors">
                Approved
              </button>
              <button className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-regular  transition-colors">
                Rejected
              </button>
            </div>
          );
        } else if (row.status === "Completed") {
          return (
            <button className="bg-[#EAB30826] text-[#EAB308] px-3 py-1.5 rounded-full text-xs font-regular transition-colors">
              View
            </button>
          );
        } else {
          return (
            <button className="bg-[#DBEAFE] text-[#2563EB] px-3 py-1.5 rounded-full text-xs font-regular hover:bg-blue-200 transition-colors">
              Track
            </button>
          );
        }
      },
      className: "text-right",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <TitleSubtitle
          title="Transfer Requests"
          subtitle="Track, assign, transfer, and monitor equipment across all construction sites and the central yard."
        />
        <div className="flex gap-3 flex-wrap ml-auto xl:mt-0 mt-5">
          <button
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <span className="text-lg leading-none">+</span> Create Transfer
            Request
          </button>

          <button
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
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
        title="TRANSFER REQUESTS LIST"
        columns={columns}
        data={equipmentData}
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

export default TransferRequestsView;
