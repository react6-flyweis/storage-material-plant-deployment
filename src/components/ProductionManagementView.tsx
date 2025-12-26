import { useState } from "react";
import StatCard from "./StatCard";
import ProductionTable from "./ProductionTable";
import UploadDrawingsModal from "./UploadDrawingsModal";

const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const leadsData = [
    {
      id: "Q-2025-1047",
      name: "John Doe",
      project: "Workshop . Texas",
      assignedTo: null,
      progress: 4,
      status: "Proposal sent",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Q-2025-1048",
      name: "John Doe",
      project: "Workshop . Texas",
      assignedTo: {
        name: "Sarah Lee",
        image: "https://i.pravatar.cc/150?u=sarah",
      },
      progress: 4,
      status: "Quotation Sent",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Q-2025-1049",
      name: "John Doe",
      project: "Workshop . Texas",
      assignedTo: {
        name: "Sarah Lee",
        image: "https://i.pravatar.cc/150?u=sarah",
      },
      progress: 4,
      status: "Proposal sent",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Q-2025-1050",
      name: "John Doe",
      project: "Workshop . Texas",
      assignedTo: {
        name: "Sarah Lee",
        image: "https://i.pravatar.cc/150?u=sarah",
      },
      progress: 4,
      status: "Proposal sent",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
  ];

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <div>
          <h1 className="text-2xl font-normal text-gray-800">
            Production Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Assign and view leads</p>
        </div>
        <div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-(--button-bg-primary-color) text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
          >
            Upload Drawings & Images
          </button>
        </div>
      </div>

      <UploadDrawingsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Equipment"
          count="128 units"
          bgColor="bg-[#0f4c9c]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--primary-color)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          }
        />
        <StatCard
          title="Available"
          count="42"
          bgColor="bg-[#4caf50]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-green)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
          }
        />
        <StatCard
          title="In Use"
          count="74"
          bgColor="bg-[#ffbb00]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-gold)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
        />
        <StatCard
          title="Under Maintenance"
          count="12"
          bgColor="bg-[#ff8a65]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-gold)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          }
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6 justify-end">
        <select className="px-2 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ">
          <option>Building types</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option>Project value</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option>All Assignments</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option>All Status</option>
        </select>
      </div>

      {/* Custom Production Table */}
      <ProductionTable data={leadsData as any[]} />
    </div>
  );
};

export default ProductionManagementView;
