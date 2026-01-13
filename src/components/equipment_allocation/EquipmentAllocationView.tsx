import { useState } from "react";
import Table, { type Column } from "../Table";
import { equipment_status_data } from "./mockData";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import CreateTransferReqModal from "./CreateTransferReqModal";
import { FilePlus, FileX, FunnelIcon } from "lucide-react";
import AssignEquipmentModal from "./AssignEquipmentModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";

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

  const columns: Column<(typeof equipment_status_data)[0]>[] = [
    {
      header: "Equipment",
      accessor: (row) => <span className="text-gray-500">{row.equipment}</span>,
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="text-gray-800 font-medium block max-w-[150px]">
          {row.category}
        </span>
      ),
    },
    {
      header: "Assigned To",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.assigned_to}</span>
      ),
    },
    {
      header: "Usage",

      accessor: (row) => <span className="text-gray-800">{row.usage}</span>,
    },
    {
      header: "Location",
      accessor: (row) => <span className="text-gray-800">{row.location}</span>,
    },
    {
      header: "Status",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium text-xs`}>{row.status}</span>
        </div>
      ),
    },
    {
      header: "GPS",
      accessor: (row) => <span className="text-gray-800">{row.gps}</span>,
    },
    {
      header: "Next Due",
      accessor: (row) => <span className="text-gray-800">{row.nextDue}</span>,
    },
    {
      header: "Action",
      accessor: () => {
        return (
          <button className="bg-[#3AB44926] text-[#3AB449] px-3 py-1.5 rounded-full text-xs font-normaltransition-colors">
            Maintain
          </button>
        );
      },
      className: "text-right",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Equipment Allocation"
          subtitle="Here’s a summary of your ongoing steel building projects."
        />
        <div className="flex gap-3 flex-wrap ml-auto xk:mt-0 mt-5">
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
        title="EQUIPMENT LIST"
        columns={columns}
        data={equipment_status_data}
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

export default EquipmentAllocationView;
