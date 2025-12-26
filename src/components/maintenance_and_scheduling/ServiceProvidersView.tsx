import React from "react";
import Table, { type Column } from "../Table";
import AddEquipmentModal from "../AddEquipmentModal";
import ReportBreakdownModal from "./ReportBreakdownModal";
import LogMaintenanceModal from "./LogMaintenanceModal";
import { mockServiceProviders } from "../../data/mockData";

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
    cellClassName: "text-gray-600",
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
    accessor: (item) => item.lastService,
  },
  {
    header: "Action",
    accessor: (item) =>
      item.id === 1 || item.id === 4 || item.id === 7 ? (
        <button className="px-4 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors">
          Assign
        </button>
      ) : (
        <button className="px-4 py-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
          View
        </button>
      ),
  },
];
const ServiceProvidersView = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const openLogModal = () => {
    setIsLogModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeLogModal = () => {
    setIsLogModalOpen(false);
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <div>
          <h1 className="text-2xl font-normal text-gray-800">
            Maintenance And Scheduling
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage preventive maintenance, repair logs, vendor services, and
            equipment health across all sites.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-1 flex-wrap">
          <button
            onClick={openModal}
            className="w-full sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span className="md:text-lg leading-none">+</span> Add Service
            Provider
          </button>

          <button
            onClick={openReportModal}
            className="w-full sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span className="md:text-lg leading-none">+</span>
            Report Breakdown
          </button>

          <button
            onClick={openLogModal}
            className="w-full sm:w-auto bg-(--button-bg-primary-color) text-white px-2 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span className="md:text-lg leading-none">+</span>Log Maintenance
          </button>
        </div>
      </div>

      <Table
        title="Service Provider Table"
        columns={serviceProviderColumns}
        data={mockServiceProviders}
        pagination={true}
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              Filter Provider
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg text-sm hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export PDF
            </button>
          </div>
        }
      />
      <AddEquipmentModal isOpen={isModalOpen} onClose={closeModal} />
      <ReportBreakdownModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
      />
      <LogMaintenanceModal isOpen={isLogModalOpen} onClose={closeLogModal} />
    </div>
  );
};

export default ServiceProvidersView;
