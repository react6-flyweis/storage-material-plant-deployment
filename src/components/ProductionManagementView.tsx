import { useMemo, useState } from "react";
import ProductionTable from "./ProductionTable";
import UploadDrawingsModal from "./UploadDrawingsModal";
import LeadsDetailsModal from "./leads/LeadsDetailsModal";
import HammerIcon from "../assets/hammerIcon.svg";
import YellowDollerIcon from "../assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "../assets/salmonGraphIcon.svg";
import CheckIcon from "../assets/icon/GreenCheckIcon.svg";
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
import FilterTabs from "./common_component/FilterTabs";
import type { TabType } from "@/pages/PlantPage";


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
      title: "Total Leads",
      value: "8",
      icon: <img src={HammerIcon} alt="equipment" className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Active",
      value: "3",
      icon: <img src={CheckIcon} alt="active" className="md:size-4 size-3" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Unassigned",
      value: "4",
      icon: (
        <img src={YellowDollerIcon} alt="unassigned" className="md:size-6 size-4" />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Unread Messages",
      value: "1",
      icon: (
        <img src={SalmonGraphIcon} alt="messages" className="md:size-6 size-4" />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
  week: [
    {
      title: "Total Leads",
      value: "7",
      icon: <img src={HammerIcon} alt="equipment" className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Active",
      value: "6",
      icon: <img src={CheckIcon} alt="active" className="md:size-4 size-3" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Unassigned",
      value: "4",
      icon: (
        <img src={YellowDollerIcon} alt="unassigned" className="md:size-6 size-4" />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Unread Messages",
      value: "2",
      icon: (
        <img src={SalmonGraphIcon} alt="messages" className="md:size-6 size-4" />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
  month: [
    {
      title: "Total Leads",
      value: "2",
      icon: <img src={HammerIcon} alt="equipment" className="md:size-6 size-4" />,
      color: "bg-[#1D51A4]",
    },
    {
      title: "Active",
      value: "23",
      icon: <img src={CheckIcon} alt="active" className="md:size-4 size-3" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Unassigned",
      value: "14",
      icon: (
        <img src={YellowDollerIcon} alt="unassigned" className="md:size-6 size-4" />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Unread Messages",
      value: "1",
      icon: (
        <img src={SalmonGraphIcon} alt="messages" className="md:size-6 size-4" />
      ),
      color: "bg-[#FD8D5B]",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [_selectedLead, _setSelectedLead] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("month");

  /* ✅ FILTER STATES */
  const [buildingType, setBuildingType] = useState<string>("all");
  const [projectValue, setProjectValue] = useState<string>("all");
  const [assignment, setAssignment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const handleViewDetails = (lead: any) => {
    _setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const leadsData = [
    {
      id: "Q-2025-1047",
      name: "John Doe",
      project: "Industrial Workshop . Texas",
      assignedTo: null,
      progress: 4,
      status: "Pending",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Q-2025-1048",
      name: "Sarah Lee",
      project: "Commercial Plaza . Nevada",
      assignedTo: { name: "Alex" },
      progress: 4,
      status: "Confirmed",
      quoteValue: "$45,000",
      unreadMessages: 1,
    },
    {
      id: "Q-2025-1049",
      name: "Michael",
      project: "Residential Villa . Florida",
      assignedTo: { name: "Sam" },
      progress: 4,
      status: "Pending",
      quoteValue: "$95,000",
      unreadMessages: 0,
    },
    {
      id: "Q-2025-1050",
      name: "David",
      project: "Industrial Plant . Ohio",
      assignedTo: null,
      progress: 4,
      status: "Confirmed",
      quoteValue: "$220,000",
      unreadMessages: 4,
    },
  ];

  /* ✅ FILTER LOGIC */
  const filteredLeads = useMemo(() => {
    return leadsData.filter((lead) => {
      const matchBuilding =
        buildingType === "all" ||
        lead.project.toLowerCase().includes(buildingType);

      const numericValue = Number(
        lead.quoteValue.replace(/[^0-9]/g, "")
      );

      const matchValue =
        projectValue === "all" ||
        (projectValue === "low" && numericValue < 50000) ||
        (projectValue === "medium" &&
          numericValue >= 50000 &&
          numericValue <= 150000) ||
        (projectValue === "high" && numericValue > 150000);

      const matchAssignment =
        assignment === "all" ||
        (assignment === "assigned" && !!lead.assignedTo) ||
        (assignment === "unassigned" && !lead.assignedTo);

      const matchStatus =
        status === "all" ||
        lead.status.toLowerCase() === status;

      return (
        matchBuilding &&
        matchValue &&
        matchAssignment &&
        matchStatus
      );
    });
  }, [buildingType, projectValue, assignment, status]);

  const stats = equipmentStatsByFilter[activeTab] ?? [];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

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

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6 justify-end w-full">
        {/* Building Types */}
        <Select onValueChange={setBuildingType}>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
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
        <Select onValueChange={setProjectValue}>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
            <SelectValue placeholder="Project value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignments */}
        <Select onValueChange={setAssignment}>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
            <SelectValue placeholder="All Assignments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-fit sm:min-w-[150px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ProductionTable
        data={filteredLeads as any[]}
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
