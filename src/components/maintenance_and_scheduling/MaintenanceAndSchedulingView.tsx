import { useState } from "react";
import Table, { type Column } from "../Table";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import StatCard from "@/components/ui/stat-card";
import TitleSubtitle from "../common_component/TitleSubtitle";
import AddServiceProviderModal from "./AddServiceProviderModal";
import TableActionButtons from "../common_component/TableActionButtons";
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";
import SuccessModal from "../common_component/SuccessModal";


const equipmentByFilter: Record<TabType, any[]> = {
  today: [
    {
      id: "EX-302",
      name: "Excavator CAT 320D",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "ABC Warehouse",
      location: "Pune Site",
      hours: "128h",
      nextDue: "20-Apr",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "Under Maintenance",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      nextDue: "15-Apr",
    },
  ],

  week: [
    {
      id: "DG-65",
      name: "Diesel Generator 65kVA",
      category: "Medium",
      status: "Breakdown",
      statusColor: "text-red-600",
      dotColor: "bg-red-500",
      project: "Metro Cast",
      location: "Ahmedabad",
      hours: "412h",
      nextDue: "20-Apr",
    },
    {
      id: "EX-302",
      name: "Excavator CAT 320D",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "ABC Warehouse",
      location: "Pune Site",
      hours: "128h",
      nextDue: "20-Apr",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "Under Maintenance",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      nextDue: "15-Apr",
    },
  ],

  month: [
    {
      id: "EX-302",
      name: "Excavator CAT 320D",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "ABC Warehouse",
      location: "Pune Site",
      hours: "128h",
      nextDue: "20-Apr",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "Under Maintenance",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      nextDue: "15-Apr",
    },
    {
      id: "DG-65",
      name: "Diesel Generator 65kVA",
      category: "Medium",
      status: "Breakdown",
      statusColor: "text-red-600",
      dotColor: "bg-red-500",
      project: "Metro Cast",
      location: "Ahmedabad",
      hours: "412h",
      nextDue: "20-Apr",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "Under Maintenance",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      nextDue: "15-Apr",
    },
  ],
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
      value: "2",
      icon: <img src={HammerIcon} className="md:size-6 size-5" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "1",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-5" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "1",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-5" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "0",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-5" />,
      color: "bg-[#FD8D5B]",
    },
  ],

  week: [
    {
      title: "Total Equipment Under Maintenance:",
      value: "5",
      icon: <img src={HammerIcon} className="md:size-6 size-5" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "2",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-5" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "3",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-5" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "1",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-5" />,
      color: "bg-[#FD8D5B]",
    },
  ],

  month: [
    {
      title: "Total Equipment Under Maintenance:",
      value: "12",
      icon: <img src={HammerIcon} className="md:size-6 size-5" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Breakdown Cases:",
      value: "42",
      icon: <img src={CheckedShieldIcon} className="md:size-6 size-5" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Maintenance Due This Week:",
      value: "74",
      icon: <img src={YellowDollerIcon} className="md:size-6 size-5" />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Overdue Maintenance:",
      value: "12",
      icon: <img src={SalmonGraphIcon} className="md:size-6 size-5" />,
      color: "bg-[#FD8D5B]",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const MaintenanceAndSchedulingView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] =
    useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const equipmentData = equipmentByFilter[activeTab];
  const equipmentStats = equipmentStatsByFilter[activeTab];

  const openReportModal = () => setIsReportModalOpen(true);
  const openLogModal = () => setIsLogModalOpen(true);
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
  const openServiceProviderModal = () => {
    setIsServiceProviderModalOpen(true);
    setModalTitle("Service Provider Added Successfully");
  };
  const closeServiceProviderModal = () =>{
    setIsServiceProviderModalOpen(false);
    setIsSuccessModalOpen(true);
    setModalTitle("Service Provider Added Successfully");
  }


  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Equipment",
      accessor: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Type",
      accessor: (row) => (
        <span className="text-gray-800 font-normal block max-w-[150px]">
          {row.name}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.category}</span>
      ),
    },
    {
      header: "Vendor",
      accessor: () => (
        <span className="text-black font-normal font-sm">ABC Machinery</span>
      ),
    },
    {
      header: "Cost",
      accessor: (row) => <span className="text-black">{row.project}</span>,
    },
    {
      header: "Notes",
      accessor: (row) => <span className="text-black">{row.location}</span>,
    },
    {
      header: "Next Due",
      accessor: (row) => (
        <span className={`font-medium text-gray-800`}>{row.nextDue}</span>
      ),
    },
    {
      header: "Action",
      accessor: (row) => {
        if (row.status === "In Use") {
          return (
            <button className="bg-[#EAB30826] text-[#EAB308] px-3 py-1.5 rounded-full text-xs font-normal">
              Update
            </button>
          );
        }
        return (
          <button className="bg-[#3AB44926] text-[#3AB449] px-3 py-1.5 rounded-full text-xs font-normal">
            Remove
          </button>
        );
      },
      className: "text-right",
      cellClassName: "text-right",
    },
  ];


  return (
    <div className="xl:pr-5 px-2  pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Maintenance And Scheduling"
          subtitle="Manage preventive maintenance, repair logs, vendor services, and equipment health across all sites."
        />
        <div className="ml-auto flex xl:mt-2 mt-5 lg:gap-2 gap-1 flex-wrap justify-end ">
          <button
            onClick={openServiceProviderModal}
            className=" sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span> Add Service Provider
          </button>

          <button
            onClick={openReportModal}
            className=" sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>
            Report Breakdown
          </button>

          <button
            onClick={openLogModal}
            className=" sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Table */}
      <Table
        title="MAINTENANCE LIST"
        columns={columns}
        data={equipmentData}
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
      <LogMaintenanceModal isOpen={isLogModalOpen} onClose={closeLogModal} onSubmit={closeLogModal} />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default MaintenanceAndSchedulingView;
