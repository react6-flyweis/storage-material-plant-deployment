import { useMemo, useState } from "react";
import ProductionTable from "./ProductionTable";
import UploadDrawingsModal from "./UploadDrawingsModal";
import LeadsDetailsModal from "./leads/LeadsDetailsModal";
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
import SuccessModal from "./common_component/SuccessModal";
import { downloadFile } from "../lib/utils";


import { UserPlus, Check, CircleDollarSign, ChartSpline, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import Button from "./common_component/Button";
import PageWrapper from "./common_component/PageWrapper";
const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [_selectedLead, _setSelectedLead] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [buildingType, setBuildingType] = useState<string>("all");
  const [projectValue, setProjectValue] = useState<string>("all");
  const [assignment, setAssignment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
console.log("status",projectValue,assignment);

  const handleViewDetails = (lead: any) => {
    _setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const leadsData = [
    {
      id: "Workshop . Texas",
      customerId: "ID-2025-1047",
      projectId: "PRJ-001",
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
      projectId: "PRJ-002",
      name: "PQR Warehouse",
      customer: { name: "Rohan Palkan", image: "https://i.pravatar.cc/150?u=2" },
      buildings: 4,
      status: "BOM Ready",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Workshop . Texas",
      customerId: "ID-2025-1049",
      projectId: "PRJ-003",
      name: "XYZ Mall Building",
      customer: { name: "Vijay", image: "https://i.pravatar.cc/150?u=3" },
      buildings: 2,
      status: "Shipper File Received",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
    {
      id: "Workshop . Texas",
      customerId: "ID-2025-1050",
      projectId: "PRJ-004",
      name: "MNP Warehouse",
      customer: { name: "John Doe", image: "https://i.pravatar.cc/150?u=4" },
      buildings: 1,
      status: "Approved",
      quoteValue: "$12,500",
      unreadMessages: 2,
    },
  ];

  const filteredLeads = useMemo(() => {
    return leadsData.filter((lead) => {
      const matchBuilding =
        buildingType === "all" ||
        lead.id.toLowerCase().includes(buildingType.toLowerCase());

      const matchStatus =
        status === "all" ||
        lead.status.toLowerCase().includes(status.toLowerCase());

      const matchProject = 
        projectValue === "all" || 
        lead.projectId.toLowerCase() === projectValue.toLowerCase() ||
        lead.name.toLowerCase().includes(projectValue.toLowerCase());

      const matchAssignment = 
        assignment === "all" || 
        lead.customer.name.toLowerCase().includes(assignment.toLowerCase());

      return (
        matchBuilding &&
        matchStatus &&
        matchProject &&
        matchAssignment
      );
    });
  }, [buildingType, status, projectValue, assignment]);

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
    <PageWrapper>
        <TitleSubtitle
          title={productionManagementText.header.title}
          subtitle={productionManagementText.header.subtitle}
        />

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
          <Button variant="white" size="sm" onClick={() => setIsUploadModalOpen(true)}>
            <ArrowUpToLine size={16} /> Import CSV
          </Button>
          <Button variant="white" size="sm" onClick={() => downloadFile("/sample-data.csv", "ProductionData.csv")}>
            <ArrowDownToLine size={16} /> Export Data
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select onValueChange={setProjectValue}>
            <SelectTrigger className="w-[140px] bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="PRJ-001">PRJ-001</SelectItem>
              <SelectItem value="PRJ-002">PRJ-002</SelectItem>
              <SelectItem value="PRJ-003">PRJ-003</SelectItem>
              <SelectItem value="PRJ-004">PRJ-004</SelectItem>
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
              <SelectItem value="vijay">Vijay</SelectItem>
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
        title={"Drawings Uploaded Successfully"}
      />
    </PageWrapper>
  );
};

export default ProductionManagementView;
