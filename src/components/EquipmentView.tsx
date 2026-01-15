import { useMemo, useState } from "react";
import Table, { type Column } from "./Table";
import AddEquipmentModal from "./AddEquipmentModal";
import StatCard from "@/components/ui/stat-card";
import TitleSubtitle from "./common_component/TitleSubtitle";
import { equipmenViewText } from "@/data/text/EquipmenViewText";
import TableActionButtons from "./common_component/TableActionButtons";
import { equipmentByFilter } from "@/data/mockData";
import { DashboardStatsByFilter, icons, type TabType } from "@/pages/PlantPage";
import FilterTabs from "./common_component/FilterTabs";
import SuccessModal from "./common_component/SuccessModal";

const CATEGORY_SEQUENCE = ["Heavy", "Medium", "All"] as const;
type CategoryFilter = (typeof CATEGORY_SEQUENCE)[number];
const EquipmentView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columns: Column<(typeof equipmentData)[0]>[] = [
    {
      header: "Equipment ID",
      accessor: (row) => <span className="text-gray-400">{row.id}</span>,
    },
    {
      header: "Name",
      accessor: (row) => (
        <span className="text-gray-400 block max-w-[150px]">{row.name}</span>
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
          <span className={`${row.statusColor} text-xs`}>{row.status}</span>
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
          className={` ${
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
            <button className="w-[120px] bg-[#E6FFFA] text-[#0D9488] px-3 py-1.5 rounded-full text-xs font-normal hover:bg-teal-100 transition-colors">
              View / Transfer
            </button>
          );
        } else if (row.status === "Breakdown") {
          return (
            <button className="w-[120px] bg-[#FFFBEB] text-[#D97706] px-3 py-1.5 rounded-full text-xs font-normal hover:bg-yellow-100 transition-colors">
              Log Issue
            </button>
          );
        } else {
          return (
            <button className="w-[120px] bg-[#DBEAFE] text-[#2563EB] px-3 py-1.5 rounded-full text-xs font-normal hover:bg-blue-200 transition-colors">
              Maintenance
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
      const currentIndex = CATEGORY_SEQUENCE.indexOf(prev);
      const nextIndex = (currentIndex + 1) % CATEGORY_SEQUENCE.length;
      return CATEGORY_SEQUENCE[nextIndex];
    });
  };

  const equipmentData = equipmentByFilter["month"];

  const filteredEquipment = useMemo(() => {
    if (activeCategory === "All") return equipmentData;

    return equipmentData.filter((item) => item.category === activeCategory);
  }, [equipmentData, activeCategory]);

  const stats = DashboardStatsByFilter[activeTab];
  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title={equipmenViewText.header.title}
          subtitle={equipmenViewText.header.subtitle}
        />
        <button
          onClick={openModal}
          className="ml-auto mt-5 xl:mt-0 bg-(--button-bg-primary-color) text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center gap-2 text-sm"
        >
          <span>+</span> Add New Equipment
        </button>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={icons[index].icon}
            color={icons[index].color}
          />
        ))}
      </div>

      <Table
        title="EQUIPMENT LIST"
        columns={columns}
        data={filteredEquipment}
        pagination={true}
        actions={
          <TableActionButtons onCickOfFilterButton={handleToggleFilter} />
        }
      />
      <AddEquipmentModal isOpen={isModalOpen} onClose={closeModal} onSubmit={()=>{
        closeModal();
        setIsSuccessModalOpen(true);
        setModalTitle("Equipment Added Successfully");
      }}/>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default EquipmentView;
