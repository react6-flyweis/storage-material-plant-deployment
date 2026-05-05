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
import SuccessModal from "./common_component/SuccessModal";


import { UserPlus, Check, CircleDollarSign, BarChart3, Upload, Download, ChartSpline, ArrowUpToLine, ArrowDownToLine } from "lucide-react";

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
      title: "Total Projects",
      value: "4",
      icon: <UserPlus className="md:size-6 size-4" />,
      color: "bg-[#1E51A4]",
    },
    {
      title: "Active Projects",
      value: "1",
      icon: <Check className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Pending Customer Approval",
      value: "1",
      icon: <CircleDollarSign className="md:size-6 size-4" />,
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled Projects",
      value: "0",
      icon: <ChartSpline className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],
  week: [
    {
      title: "Total Projects",
      value: "12",
      icon: <UserPlus className="md:size-6 size-4" />,
      color: "bg-[#1E51A4]",
    },
    {
      title: "Active Projects",
      value: "8",
      icon: <Check className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Pending Customer Approval",
      value: "3",
      icon: <CircleDollarSign className="md:size-6 size-4" />,
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled Projects",
      value: "1",
      icon: <ChartSpline className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],
  month: [
    {
      title: "Total Projects",
      value: "45",
      icon: <UserPlus className="md:size-6 size-4" />,
      color: "bg-[#1E51A4]",
    },
    {
      title: "Active Projects",
      value: "32",
      icon: <Check className="md:size-6 size-4" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Pending Customer Approval",
      value: "10",
      icon: <CircleDollarSign className="md:size-6 size-4" />,
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled Projects",
      value: "3",
      icon: <ChartSpline className="md:size-6 size-4" />,
      color: "bg-[#FD8D5B]",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [_selectedLead, _setSelectedLead] = useState<any>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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
      id: "Workshop . Texas",
      customerId: "ID-2025-1047",
      name: "ABC Constructions",
      customer: { name: "John Doe", image: "https://i.pravatar.cc/150?u=1" },
      buildings: 1,
      status: "Approved",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Warehouse . Texas",
      customerId: "ID-2025-1048",
      name: "PQR Warehouse",
      customer: { name: "Roahan Sharma", image: "https://i.pravatar.cc/150?u=2" },
      buildings: 4,
      status: "BOM Ready",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Workshop . Texas",
      customerId: "ID-2025-1049",
      name: "XYZ Mall Building",
      customer: { name: "Riyaz Verma", image: "https://i.pravatar.cc/150?u=3" },
      buildings: 2,
      status: "Shipper File Received",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Workshop . Texas",
      customerId: "ID-2025-1050",
      name: "MNP Warehouse",
      customer: { name: "Riya Wellness", image: "https://i.pravatar.cc/150?u=4" },
      buildings: 1,
      status: "Shipper File Received",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
  ];

  /* ✅ FILTER LOGIC */
  const filteredLeads = useMemo(() => {
    return leadsData.filter((lead) => {
      const matchBuilding =
        buildingType === "all" ||
        lead.id.toLowerCase().includes(buildingType);

      const matchStatus =
        status === "all" ||
        lead.status.toLowerCase().includes(status.toLowerCase());

      return (
        matchBuilding &&
        matchStatus
      );
    });
  }, [buildingType, status]);

  const stats = [
    {
      title: "Total Projects",
      value: "4",
      icon: <UserPlus className="md:size-6 size-4 text-[#1E51A4]" />,
      color: "bg-[#1E51A4]",
    },
    {
      title: "Active Projects",
      value: "1",
      icon: <Check className="md:size-6 size-4 text-[#3AB449]" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Pending Customer Approval",
      value: "1",
      icon: <CircleDollarSign className="md:size-6 size-4 text-[#EAB308]" />,
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled Projects",
      value: "0",
      icon: <ChartSpline className="md:size-6 size-4 text-[#FD8D5B]" />,
      color: "bg-[#FD8D5B]",
    },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap mt-1 mb-6">
        <TitleSubtitle
          title={productionManagementText.header.title}
          subtitle={productionManagementText.header.subtitle}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Action Buttons & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowUpToLine size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowDownToLine size={16} /> Export Data
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select onValueChange={setProjectValue}>
            <SelectTrigger className="w-[140px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setAssignment}>
            <SelectTrigger className="w-[180px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Customer</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="rohan">Rohan Palkan</SelectItem>
              <SelectItem value="vijay">Vijay Chadda</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setBuildingType}>
            <SelectTrigger className="w-[160px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="Building types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Building types</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="bom">BOM Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      
      <UploadDrawingsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={()=>{
          setIsUploadModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Drawings Uploaded Successfully"
      />
    </div>
  );
};

export default ProductionManagementView;
