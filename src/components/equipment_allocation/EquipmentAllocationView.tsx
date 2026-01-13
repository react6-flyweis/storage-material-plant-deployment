import { useState, useMemo } from "react";
import Table, { type Column } from "../Table";
import { equipment_status_data } from "./mockData";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import CreateTransferReqModal from "./CreateTransferReqModal";
import AssignEquipmentModal from "./AssignEquipmentModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";


const equipmentByFilter: Record<TabType, typeof equipment_status_data> = {
  today: equipment_status_data.slice(0, 3),
  week: equipment_status_data.slice(0, 6),
  month: equipment_status_data,
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
      title: "Total Equipment",
      value: "3 units",
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
      value: "1",
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
      value: "1",
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
      value: "1",
      icon: (
        <img
          src={SalmonGraphIcon}
          alt="under-maintenance"
          className="md:size-4 size-3"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
  week: [
    {
      title: "Total Equipment",
      value: "6 units",
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
      value: "3",
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
      value: "2",
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
      value: "1",
      icon: (
        <img
          src={SalmonGraphIcon}
          alt="under-maintenance"
          className="md:size-4 size-3"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
  month: [
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
          className="md:size-4 size-3"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
};


const EquipmentAllocationView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [isCategoryFilterOn, setIsCategoryFilterOn] = useState(false);

  const closeTransferModal = () => setIsTransferModalOpen(false);
  const closeModal = () => setIsModalOpen(false);

  const toggleCategoryFilter = () => {
    setIsCategoryFilterOn((prev) => !prev);
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

  const stats = equipmentStatsByFilter[activeTab];
  const baseData = equipmentByFilter[activeTab];

  // ✅ APPLY CATEGORY FILTER
  const filteredData = useMemo(() => {
    if (!isCategoryFilterOn) return baseData;

    return baseData.filter((item) => item.category === "Heavy");
  }, [baseData, isCategoryFilterOn]);

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* FILTER TABS */}
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

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
      <Table
        title="EQUIPMENT LIST"
        columns={columns}
        data={filteredData}
        pagination={true}
        actions={
          <TableActionButtons onCickOfFilterButton={toggleCategoryFilter} />
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
