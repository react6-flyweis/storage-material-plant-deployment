import { useMemo, useState } from "react";
import Table, { type Column } from "../Table";
import StatCard from "@/components/ui/stat-card";
import HammerIcon from "../../assets/hammerIcon.svg";
import CheckedShieldIcon from "../../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../../assets/salmonGraphIcon.svg";
import AddMaterialModal from "./AddMaterialModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import TableActionButtons from "../common_component/TableActionButtons";
import type { TabType } from "@/pages/PlantPage";
import FilterTabs from "../common_component/FilterTabs";
import SuccessModal from "../common_component/SuccessModal";


export const MaterialStatsByFilter: Record<
  TabType,
  {
    title: string;
    value: string;
  }[]
> = {
  today: [
    { title: "Total Material", value: "247 units" },
    { title: "Available", value: "89" },
    { title: "In Use", value: "104" },
    { title: "Under Maintenance", value: "34" },
  ],

  week: [
    { title: "Total Material", value: "112 units" },
    { title: "Available", value: "62" },
    { title: "In Use", value: "56" },
    { title: "Under Maintenance", value: "24" },
  ],

  month: [
    { title: "Total Material", value: "120 units" },
    { title: "Available", value: "108" },
    { title: "In Use", value: "98" },
    { title: "Under Maintenance", value: "24" },
  ],
} as const;

export const icons = [
  {
    icon: <img src={HammerIcon} alt="leads" className="md:size-6 size-4" />,
    color: "bg-[#1D51A4]",
  },
  {
    icon: (
      <img
        src={CheckedShieldIcon}
        alt="confirmed"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#3AB449]",
  },
  {
    icon: (
      <img src={YellowDollerIcon} alt="value" className="md:size-6 size-4" />
    ),
    color: "bg-[#F59E0B]",
  },
  {
    icon: (
      <img src={SalmonGraphIcon} alt="revenue" className="md:size-6 size-4" />
    ),
    color: "bg-[#FD8D5B]",
  },
];

const CATEGORY_SEQUENCE = ["All", "Cement", "Diesel", "Medium"] as const;
type CategoryFilter = (typeof CATEGORY_SEQUENCE)[number];
const MaterialInventoryView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const inventoryEquipmentByFilter: Record<
    TabType,
    {
      id: string;
      name: string;
      category: string;
      status: string;
      statusColor: string;
      dotColor: string;
      project: string;
      location: string;
      hours: string;
      minLevel: string;
      stock: string;
      unit: string;
      updated: string;
      action: string;
      material: string;
    }[]
  > = {
    today: [
      {
        id: "EX-302",
        name: "Excavator CAT 320D",
        category: "Cement",
        status: "🔴 Low",
        statusColor: "text-red-600",
        dotColor: "bg-red-500",
        project: "ABC Warehouse",
        location: "Pune Site",
        hours: "128h",
        minLevel: "300",
        stock: "230",
        unit: "Bags",
        updated: "12-Jan",
        action: "Reorder",
        material: "Cement OPC 53",
      },
      {
        id: "DG-65",
        name: "Diesel Generator 65kVA",
        category: "Diesel",
        status: "🟡 Near Low",
        statusColor: "text-orange-600",
        dotColor: "bg-orange-500",
        project: "Metro Cast",
        location: "Ahmedabad",
        hours: "412h",
        minLevel: "250",
        stock: "260",
        unit: "Liters",
        updated: "12-Jan",
        action: "Purchase",
        material: "Diesel",
      },
      {
        id: "CM-104",
        name: "Concrete Mixer 350L",
        category: "Medium",
        status: "🟢 Ok",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "-",
        location: "Yard",
        hours: "-",
        minLevel: "10",
        stock: "22",
        unit: "Units",
        updated: "12-Jan",
        action: "Update",
        material: "Concrete OPC 53",
      },
    ],

    week: [
      {
        id: "EX-410",
        name: "Excavator Komatsu PC200",
        category: "Cement",
        status: "🟡 Near Low",
        statusColor: "text-orange-600",
        dotColor: "bg-orange-500",
        project: "Ring Road Project",
        location: "Nagpur",
        hours: "244h",
        minLevel: "300",
        stock: "310",
        unit: "Bags",
        updated: "10-Jan",
        action: "Monitor",
        material: "Cement PPC",
      },
      {
        id: "DG-88",
        name: "Diesel Generator 88kVA",
        category: "Diesel",
        status: "🟢 Ok",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "Metro Phase 2",
        location: "Delhi",
        hours: "355h",
        minLevel: "300",
        stock: "420",
        unit: "Liters",
        updated: "09-Jan",
        action: "Update",
        material: "Diesel",
      },
      {
        id: "CM-210",
        name: "Concrete Mixer 500L",
        category: "Medium",
        status: "🔴 Low",
        statusColor: "text-red-600",
        dotColor: "bg-red-500",
        project: "Airport Expansion",
        location: "Hyderabad",
        hours: "-",
        minLevel: "15",
        stock: "6",
        unit: "Units",
        updated: "11-Jan",
        action: "Reorder",
        material: "Concrete OPC 43",
      },
    ],

    month: [
      {
        id: "EX-990",
        name: "Excavator Volvo EC300",
        category: "Cement",
        status: "🟢 Ok",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "Highway Expansion",
        location: "Pune",
        hours: "612h",
        minLevel: "500",
        stock: "780",
        unit: "Bags",
        updated: "05-Jan",
        action: "Update",
        material: "Cement OPC 53",
      },
      {
        id: "DG-120",
        name: "Diesel Generator 120kVA",
        category: "Diesel",
        status: "🔴 Low",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "IT Park",
        location: "Bangalore",
        hours: "742h",
        minLevel: "600",
        stock: "940",
        unit: "Liters",
        updated: "06-Jan",
        action: "Update",
        material: "Diesel",
      },
      {
        id: "CM-550",
        name: "Concrete Mixer 550L",
        category: "Medium",
        status: "🟢 Ok",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "-",
        location: "Central Yard",
        hours: "-",
        minLevel: "20",
        stock: "48",
        unit: "Units",
        updated: "08-Jan",
        action: "Update",
        material: "Concrete OPC 53",
      },
      {
        id: "CM-551",
        name: "Concrete Mixer 1050L",
        category: "Medium",
        status: "🟡 Near Low",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        project: "-",
        location: "Middle Yard",
        hours: "-",
        minLevel: "20",
        stock: "68",
        unit: "Units",
        updated: "08-Jan",
        action: "Update",
        material: "Concrete OPC 53",
      },
    ],
  } as const;

  const columns: Column<any>[] = [
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


  
  const handleToggleFilter = () => {
    setActiveCategory((prev) => {
      const index = CATEGORY_SEQUENCE.indexOf(prev);
      return CATEGORY_SEQUENCE[(index + 1) % CATEGORY_SEQUENCE.length];
    });
  };

  const filteredData = useMemo(() => {
    if (activeCategory === "All") return inventoryEquipmentByFilter[activeTab];
    return inventoryEquipmentByFilter[activeTab].filter(
      (item) => item.category === activeCategory
    );
  }, [inventoryEquipmentByFilter, activeCategory]);



  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
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
        {MaterialStatsByFilter[activeTab].map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={icons[index].icon}
            color={icons[index].color}
          />
        ))}
      </div>
      <Table
        title="MATERIAL INVENTORY LIST"
        columns={columns}
        data={filteredData}
        pagination={true}
        actions={
          <TableActionButtons onCickOfFilterButton={handleToggleFilter} />
        }
      />
      <AddMaterialModal isOpen={isModalOpen} onClose={closeModal} onSubmit={()=>{
        closeModal();
        setIsSuccessModalOpen(true);
      }} />
      <SuccessModal isOpen={isSuccessModalOpen} onClose={()=>setIsSuccessModalOpen(false)} title="Material Stock Added Successfully" />
    </div>
  );
};

export default MaterialInventoryView;
