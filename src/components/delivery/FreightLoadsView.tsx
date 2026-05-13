import React, { useState } from "react";
import { 
  Download, 
  Award, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  Eye, 
  MoreHorizontal,
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import CommonStatusBadge, { type BadgeVariant } from "../common_component/CommonStatusBadge";
import { useNavigate } from "react-router-dom";
import FreightFilterModal from "./FreightFilterModal";
import SearchFilterBar from "../common_component/SearchFilterBar";

const mockFreightLoads = [
  {
    id: "LOAD-002",
    requestedDate: "2024-03-16",
    project: "Storage Facility B",
    description: "Roll-up door panels",
    route: { from: "Dallas, TX", to: "San Antonio, TX" },
    dates: { pickup: "2024-03-27", delivery: "2024-03-28" },
    bids: "$12000",
    status: "Awarded",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021"
  },
  {
    id: "LOAD-005",
    requestedDate: "2024-03-16",
    project: "Industrial Complex A",
    description: "Secondary steel beams",
    route: { from: "Houston, TX", to: "Austin, TX" },
    dates: { pickup: "2024-03-28", delivery: "2024-03-29" },
    bids: "$12000",
    status: "Requested",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021"
  },
  {
    id: "LOAD-007",
    requestedDate: "2024-03-16",
    project: "Warehouse Complex",
    description: "Electrical fixtures - bulk",
    route: { from: "San Antonio, TX", to: "Fort Worth, TX" },
    dates: { pickup: "2024-03-30", delivery: "2024-03-31" },
    bids: "$12000",
    status: "Bids Received",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021"
  }
];

const statsData = [
  { 
    title: "Total Awarded", 
    value: "4", 
    icon: Award, 
    color: "text-[#00C853]", 
    borderL: "border-[#00C853]" 
  },
  { 
    title: "In Transit", 
    value: "1", 
    icon: Truck, 
    color: "text-[#FF8800]", 
    borderL: "border-[#FF8800]" 
  },
  { 
    title: "Delivered", 
    value: "1", 
    icon: CheckCircle2, 
    color: "text-[#00C853]", 
    borderL: "border-[#00C853]" 
  },
  { 
    title: "Total Spent", 
    value: "$7,650", 
    icon: DollarSign, 
    color: "text-[#4169B8]", 
    borderL: "border-[#4169B8]" 
  },
  { 
    title: "Requested Loads", 
    value: "4", 
    icon: Truck, 
    color: "text-[#FF00C3]", 
    borderL: "border-[#FF00C3]" 
  },
  { 
    title: "Bids Pending", 
    value: "0", 
    icon: null, 
    color: "text-[#155DFC]", 
    borderL: "border-[#155DFC]" 
  },
];

export const StatCard = ({ title, value, icon: Icon, color, borderL }: any) => (
  <div
    className={`flex-1 bg-white p-3 md:p-5 rounded-[14px] border border-l-2 md:border-l-4 ${borderL} flex flex-col justify-between shadow-sm font-inter min-w-[180px] md:h-32 transition-all hover:shadow-md md:max-w-[210px]`}
  >
    <div className={`${color}`}>
      <p className="text-sm font-medium text-[#4A5565] mt-1">{title}</p>
      <div className="flex justify-between items-start mt-3">
        <p className="text-xl md:text-3xl  font-normal text-(--text-color-gray-5) leading-none mb-1">
          {value}
        </p>
        {Icon && <Icon className="size-6 md:size-9" strokeWidth={2} />}
      </div>
    </div>
  </div>
);

const FreightLoadsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "Awarded":
        return "green";
      case "Requested":
        return "yellow";
      case "Bids Received":
        return "blue";
      default:
        return "gray";
    }
  };

  const tableHeaders = [
    { label: "Request ID", align: "text-left" },
    { label: "Project", align: "text-left" },
    { label: "Description", align: "text-left" },
    { label: "Route", align: "text-center" },
    { label: "Dates", align: "text-left" },
    { label: "Bids", align: "text-left" },
    { label: "Status", align: "text-center" },
    { label: "Actions", align: "text-center" },
    { label: "Load Size / Weight", align: "text-left" },
    { label: "Delivery Link", align: "text-left" },
  ];

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-5 space-y-8 mt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <TitleSubtitle
          title="Freight Loads"
          subtitle="Track all awarded freight loads"
        />
        <div className="flex items-center gap-3">
          <Button variant="gradient" size="sm">
            <Download size={18} className="mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap items-center justify-start gap-2">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search freight loads..."
        onFilterClick={() => setIsFilterModalOpen(true)}
      />

      {/* Freight Loads Table */}
      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className={`p-2 md:p-4 text-[#637381] font-normal text-xs md:text-sm tracking-wider uppercase ${header.align}`}>
                    {header.label}
                  </th>
                ))}
                <th className="p-2 md:p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockFreightLoads.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="font-normal text-(--text-color-gray-5) text-sm">{item.id}</div>
                    <div className="text-xs font-normal text-[#101828] mt-0.5">Requested: {item.requestedDate}</div>
                  </td>
                  <td className="p-2 md:p-4 font-medium text-(--text-color-gray-5) text-sm">{item.project}</td>
                  <td className="p-2 md:p-4 text-(--text-color-gray-4) text-sm">{item.description}</td>
                  <td className="p-2 md:p-4 text-center">
                    <div className="text-xs  font-normal text-(--text-color-gray-5)">{item.route.from}</div>
                    <div className="text-[#919EAB] text-xs py-0.5  font-normal">↓</div>
                    <div className="text-xs  font-normal text-(--text-color-gray-5)">{item.route.to}</div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="text-xs text-[#637381] font-medium">Pickup: <span className="text-(--text-color-gray-5)  font-normal">{item.dates.pickup}</span></div>
                    <div className="text-xs text-[#637381] font-medium">Delivery: <span className="text-(--text-color-gray-5)  font-normal">{item.dates.delivery}</span></div>
                  </td>
                  <td className="p-2 md:p-4 font-normal text-(--text-color-gray-5) text-sm">{item.bids}</td>
                  <td className="p-2 md:p-4 text-center">
                    <CommonStatusBadge 
                      text={item.status} 
                      variant={getBadgeVariant(item.status)} 
                    />
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <Button 
                      variant="white" 
                      size="sm"
                      onClick={() => navigate(`/delivery/freight-load/${item.id}`)}
                    >
                      <Eye size={16} className="mr-2" /> View
                    </Button>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="text-sm  font-normal text-(--text-color-gray-5)">{item.loadSize}</div>
                    <div className="text-[12px] font-medium text-[#637381]">{item.pallets}</div>
                  </td>
                  <td className="p-2 md:p-4  font-normal text-(--text-color-gray-5) text-sm underline decoration-[#919EAB] underline-offset-4 cursor-pointer hover:text-[#1E51A4] transition-colors">{item.deliveryLink}</td>
                  <td className="p-2 md:p-4">
                    <button className="text-[#919EAB] hover:text-(--text-color-gray-5) transition-colors p-2 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FreightFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        onApply={(f) => { console.log(f); setIsFilterModalOpen(false); }}
      />
    </div>
  );
};

export default FreightLoadsView;
