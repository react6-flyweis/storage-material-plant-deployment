import React from "react";
import Table, { type Column } from "../Table";
import StatCard from "@/components/ui/stat-card";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import AddMaterialModal from "./AddEquipmentModal";
import { FilePlus, FileX, FunnelIcon } from "lucide-react";

const MaterialInventoryView = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const equipmentData = [
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
      nextDue: "Overdue",
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
      nextDue: "Overdue",
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
  ];

  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Material",
      accessor: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="text-gray-500 font-medium block max-w-[150px]">
          {row.name}
        </span>
      ),
    },
    {
      header: "Stock",
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
      header: "Unit",
      accessor: (row) => <span className="text-gray-800">{row.project}</span>,
    },
    {
      header: "Location",
      accessor: (row) => <span className="text-gray-800">{row.location}</span>,
    },
    {
      header: "Updated",
      accessor: (row) => <span className="text-gray-800">{row.hours}</span>,
    },
    {
      header: "Min Level",
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

  const equipmentStats = [
    {
      title: "Total Material",
      value: "128 units",
      icon: (
        <img src={HammerIcon} alt="equipment" className="size-5 sm:size-7" />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Available",
      value: "42",
      icon: (
        <img
          src={CheckedShieldIcon}
          alt="available"
          className="size-5 sm:size-7"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "In Use",
      value: "74",
      icon: (
        <img src={YellowDollerIcon} alt="in-use" className="size-5 sm:size-7" />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Under Maintenance",
      value: "12",
      icon: (
        <img
          src={SalmonGraphIcon}
          alt="maintenance"
          className="size-5 sm:size-7"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ];

  return (
    <div className="md:pr-5 pt-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <div className="">
          <h1 className="md:text-2xl text-xl font-normal text-gray-800 mb-2">
            Material Inventory
          </h1>
          <p className="text-(--text-color-gray-2) text-sm">
            Here’s a summary of your ongoing steel building projects.
          </p>
        </div>
        <button
          onClick={openModal}
          className="xl:mt-0 mt-2 bg-(--button-bg-primary-color) text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center gap-2 text-sm"
        >
          <span>+</span> Add Material Stock
        </button>
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
        title="MATERIAL INVENTORY LIST"
        columns={columns}
        data={equipmentData}
        pagination={true}
        actions={
          <div className="flex gap-2">
            <button className="flex flex-wrap ml-auto items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
              <FunnelIcon className="w-4 h-4" />
              Filter Equipment
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
              <FileX className="w-4 h-4" />
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg md:text-sm text-xs hover:opacity-80">
              <FilePlus className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        }
      />
      <AddMaterialModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default MaterialInventoryView;
