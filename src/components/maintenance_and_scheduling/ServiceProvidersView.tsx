import { useState } from "react";
import Table, { type Column } from "../Table";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import { mockServiceProviders } from "../../data/mockData";
import { FilePlus, FileX, Funnel } from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import AddServiceProviderModal from "./AddServiceProviderModal";
import FilterTabs from "../common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";

export type ServiceProvider = {
  id: number;
  providerName: string;
  services: string;
  contact: string;
  rating: number;
  avgCost: string;
  lastService: string;
};

const renderStars = (rating: number) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={index < rating ? 0 : 1.5}
        className="w-4 h-4 text-gray-900"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ))}
  </div>
);


export const serviceProviderColumns: Column<ServiceProvider>[] = [
  {
    header: "Provider Name",
    accessor: (item) => item.providerName,
    cellClassName: "text-gray-600 min-w-[120px]",
  },
  {
    header: "Services",
    accessor: (item) => item.services,
  },
  {
    header: "Contact",
    accessor: (item) => item.contact,
  },
  {
    header: "Rating",
    accessor: (item) => renderStars(item.rating),
  },
  {
    header: "Avg Cost",
    accessor: (item) => item.avgCost,
  },
  {
    header: "Last Service",
    accessor: (item) => (
      <div className="min-w-[80px] font-normal text-xs">{item.lastService}</div>
    ),
  },
  {
    header: "Action",
    accessor: (item) =>
      item.id === 1 || item.id === 4 || item.id === 7 ? (
        <button className="px-4 py-1.5 bg-[#EAB30826] text-[#EAB308] rounded-full text-xs font-normal hover:bg-yellow-200 transition-colors">
          Assign
        </button>
      ) : (
        <button className="px-4 py-1.5 bg-[#3AB44926] text-[#3AB449] rounded-full text-xs font-normal hover:bg-green-200 transition-colors">
          View
        </button>
      ),
  },
];

const serviceProvidersByFilter: Record<TabType, ServiceProvider[]> = {
  today: mockServiceProviders.slice(0, 3),
  week: mockServiceProviders.slice(0, 6),
  month: mockServiceProviders,
};


const ServiceProvidersView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] =
    useState(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const openLogModal = () => setIsLogModalOpen(true);
  const openServiceProviderModal = () =>
    setIsServiceProviderModalOpen(true);

  const closeReportModal = () => setIsReportModalOpen(false);
  const closeLogModal = () => setIsLogModalOpen(false);
  const closeServiceProviderModal = () =>
    setIsServiceProviderModalOpen(false);

  const tableData = serviceProvidersByFilter[activeTab];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title="Service Providers"
          subtitle="Here’s a summary of your ongoing steel building projects."
        />
        <div className="flex xl:mt-2 mt-5 lg:gap-2 gap-1 flex-wrap ml-auto">
          <button
            onClick={openServiceProviderModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span> Add Service
            Provider
          </button>

          <button
            onClick={openReportModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>
            Report Breakdown
          </button>

          <button
            onClick={openLogModal}
            className="sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-normal shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 md:text-sm text-xs"
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>

      <Table
        title="Service Provider Table"
        columns={serviceProviderColumns}
        data={tableData}
        pagination={true}
        actions={
          <div className="flex gap-2 flex-wrap mt-2 md:mt-0 justify-end ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-normal xl:text-sm text-xs hover:bg-gray-50">
              <Funnel className="w-4 h-4" />
              Filter Provider
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-normal xl:text-sm text-xs hover:bg-gray-50">
              <FileX className="w-4 h-4" />
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg xl:text-sm text-xs hover:opacity-80">
              <FilePlus className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        }
      />

      <AddServiceProviderModal
        isOpen={isServiceProviderModalOpen}
        onClose={closeServiceProviderModal}
      />
      <ReportBreakdownModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
      />
      <LogMaintenanceModal isOpen={isLogModalOpen} onClose={closeLogModal} />
    </div>
  );
};

export default ServiceProvidersView;
