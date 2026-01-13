import React from "react";
import Table, { type Column } from "../Table";
import StatCard from "@/components/ui/stat-card";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import AddMaterialModal from "./AddMaterialModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";

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
      category: "Cement",
      status: "🔴 Low",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "ABC Warehouse",
      location: "Pune Site",
      hours: "128h",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Reorder",
      material: "Cement OPC 53",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "🟢 Ok",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Update",
      material: "Concrete OPC 53",
    },
    {
      id: "DG-65",
      name: "Diesel Generator 65kVA",
      category: "Diesel",
      status: "🟡 Near Low",
      statusColor: "text-red-600",
      dotColor: "bg-red-500",
      project: "Metro Cast",
      location: "Ahmedabad",
      hours: "412h",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Purchase",
      material: "Diesel Generator 65kVA",
    },
    {
      id: "EX-302",
      name: "Excavator CAT 320D",
      category: "Cement",
      status: "🟢 Ok",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "ABC Warehouse",
      location: "Pune Site",
      hours: "128h",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Purchase",
      material: "Concrete OPC 53",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Medium",
      status: "🟢 Ok",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Update",
      material: "Concrete OPC 53",
    },
    {
      id: "DG-65",
      name: "Diesel Generator 65kVA",
      category: "Cement",
      status: "🟡 Near Low",
      statusColor: "text-red-600",
      dotColor: "bg-red-500",
      project: "Metro Cast",
      location: "Ahmedabad",
      hours: "412h",
      minLevel: "100",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Purchase",
      material: "Diesel Generator 65kVA",
    },
    {
      id: "CM-104",
      name: "Concrete Mixer 350L",
      category: "Cement",
      status: "🟢 Ok",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Yard",
      hours: "-",
      minLevel: "10",
      stock: "230",
      unit: "Bags",
      updated: "08-Apr",
      action: "Update",
      material: "Concrete OPC 53",
    },
  ];

  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Material",
      accessor: (row) => <span className="text-gray-500">{row.material}</span>,
    },
    {
      header: "Category",
      accessor: (row) => (
        <span className="text-gray-500 font-medium block max-w-[150px]">
          {row.category}
        </span>
      ),
    },
    {
      header: "Stock",
      accessor: (row) => (
        <span className="text-gray-700 font-medium">{row.stock}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`font-normal text-black text-sm`}>{row.status}</span>
        </div>
      ),
    },
    {
      header: "Unit",
      accessor: (row) => <span className="text-gray-800">{row.unit}</span>,
    },
    {
      header: "Location",
      accessor: (row) => <span className="text-gray-800">{row.location}</span>,
    },
    {
      header: "Updated",
      accessor: (row) => <span className="text-gray-800">{row.updated}</span>,
    },
    {
      header: "Min Level",
      accessor: (row) => (
        <span className={`font-medium ${"text-gray-800"}`}>{row.minLevel}</span>
      ),
    },
    {
      header: "Action",
      accessor: (row) => {
        if (row.action === "Update") {
          return (
            <button className="w-[100px] bg-[#2563EB26] text-[#2563EB] py-1.5 rounded-full text-xs font-normal transition-colors">
              Update
            </button>
          );
        } else if (row.action === "Reorder") {
          return (
            <button
              onClick={openModal}
              className=" w-[100px] bg-[#EAB30826] text-[#EAB308] py-1.5 rounded-full text-xs font-normal transition-colors"
            >
              Reorder
            </button>
          );
        } else {
          return (
            <button className="w-[100px] bg-[#EF444426] text-[#EF4444] py-1.5 rounded-full text-xs font-normal transition-colors">
              Purchase
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
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Material Inventory"
          subtitle="Here’s a summary of your ongoing steel building projects."
        />
        <button
          onClick={openModal}
          className="xl:mt-0 mt-2 bg-(--button-bg-primary-color) text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center gap-2 text-sm"
        >
          <span>+</span> Add Material Stock
        </button>
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
        title="MATERIAL INVENTORY LIST"
        columns={columns}
        data={equipmentData}
        pagination={true}
        actions={<TableActionButtons />}
      />
      <AddMaterialModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default MaterialInventoryView;
