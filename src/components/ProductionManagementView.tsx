import { useState } from "react";
import ProductionTable from "./ProductionTable";
import UploadDrawingsModal from "./UploadDrawingsModal";
import LeadsDetailsModal from "./leads/LeadsDetailsModal";
import HammerIcon from "../assets/hammerIcon.svg";
import CheckedShieldIcon from "../assets/checkedShieldIcon.svg";
import YellowDollerIcon from "../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../assets/salmonGraphIcon.svg";
import StatCard from "./ui/stat-card";
import TitleSubtitle from "./common_component/TitleSubtitle";
import { productionManagementText } from "@/data/text/productionManagementText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [_selectedLead, _setSelectedLead] = useState<any>(null);

  const handleViewDetails = (lead: any) => {
    _setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };
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

  const equipmentStats = [
    {
      title: "Total Leads",
      value: "1",
      icon: (
        <img src={HammerIcon} alt="equipment" className="md:size-7 size-5" />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Active",
      value: "42",
      icon: (
        <img
          src={CheckedShieldIcon}
          alt="available"
          className="md:size-7 size-5"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "Unassigned",
      value: "74",
      icon: (
        <img src={YellowDollerIcon} alt="in-use" className="md:size-7 size-5" />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Unread Messages",
      value: "12",
      icon: (
        <img
          src={SalmonGraphIcon}
          alt="maintenance"
          className="md:size-7 size-5"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ];
  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title={productionManagementText.header.title}
          subtitle={productionManagementText.header.subtitle}
        />

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="ml-auto mt-2 bg-(--button-bg-primary-color) text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-80 transition-colors flex items-center gap-2 text-sm"
        >
          <span>+</span> Upload Drawings & Images
        </button>
      </div>

      <UploadDrawingsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Stats Row */}
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

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6 justify-end w-full">
        {/* Building Types */}
        <Select>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Building types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
          </SelectContent>
        </Select>

        {/* Project Value */}
        <Select>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Project value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignments */}
        <Select>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="All Assignments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select defaultValue="">
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Production Table */}
      <ProductionTable
        data={leadsData as any[]}
        onViewDetails={handleViewDetails}
      />

      <LeadsDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

export default ProductionManagementView;
