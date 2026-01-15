import { useState, useMemo } from "react";
import Table, { type Column } from "../Table";
import { equipmentData } from "./mockData";
import StatCard from "@/components/ui/stat-card";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import AssignEquipmentModal from "./AssignEquipmentModal";
import CreateTransferReqModal from "./CreateTransferReqModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";
import SuccessModal from "../common_component/SuccessModal";

const transferRequestsByFilter: Record<TabType, typeof equipmentData> = {
  today: equipmentData.slice(0, 2),
  week: equipmentData.slice(0, 4),
  month: equipmentData,
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
      title: "Pending Requests:",
      value: "2",
      icon: (
        <img
          src={HammerIcon}
          alt="total-maintenance"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Approved:",
      value: "1",
      icon: (
        <img
          src={CheckedShieldIcon}
          alt="breakdown"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "In Transit:",
      value: "1",
      icon: (
        <img
          src={YellowDollerIcon}
          alt="due-maintenance"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#F59E0B]",
    },
  ],
  week: [
    {
      title: "Pending Requests:",
      value: "6",
      icon: (
        <img
          src={HammerIcon}
          alt="total-maintenance"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Approved:",
      value: "4",
      icon: (
        <img
          src={CheckedShieldIcon}
          alt="breakdown"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "In Transit:",
      value: "2",
      icon: (
        <img
          src={YellowDollerIcon}
          alt="due-maintenance"
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#F59E0B]",
    },
  ],
  month: [
    {
      title: "Pending Requests:",
      value: "12",
      icon: (
        <img
          src={HammerIcon}
          alt="total-maintenance"
          className="md:size-6 size-5"
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
          className="md:size-6 size-5"
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
          className="md:size-6 size-5"
        />
      ),
      color: "bg-[#F59E0B]",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const TransferRequestsView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCategoryFilterOn, setIsCategoryFilterOn] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Transfer Request Created Successfully");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Equipment Assigned Successfully");
  };

  const toggleCategoryFilter = () => {
    setIsCategoryFilterOn((prev) => !prev);
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
              <button className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-regular transition-colors">
                Approved
              </button>
              <button className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-regular transition-colors">
                Rejected
              </button>
            </div>
          );
        } else if (row.status === "Breakdown") {
          return (
            <div className="flex justify-around gap-2">
              <button className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-regular transition-colors">
                Approved
              </button>
              <button className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-regular transition-colors">
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

  const stats = equipmentStatsByFilter[activeTab];
  const baseData = transferRequestsByFilter[activeTab];

  const filteredData = useMemo(() => {
    if (!isCategoryFilterOn) return baseData;

    return baseData.filter((item) => item.category === "Heavy");
  }, [baseData, isCategoryFilterOn]);

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* FILTER TABS */}
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

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
        title="TRANSFER REQUESTS LIST"
        columns={columns}
        data={filteredData}
        pagination={true}
        actions={
          <TableActionButtons
            onCickOfFilterButton={toggleCategoryFilter}
          />
        }
      />

      <CreateTransferReqModal
        isOpen={isTransferModalOpen}
        onClose={closeTransferModal}
        onSubmit={closeTransferModal}
      />
      <AssignEquipmentModal isOpen={isModalOpen} onClose={closeModal} onSubmit={closeModal} />
      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title={modalTitle}/>
    </div>
  );
};

export default TransferRequestsView;
