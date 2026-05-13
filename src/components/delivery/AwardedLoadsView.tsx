import React, { useState } from "react";
import { 
  Download, 
  Award, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  Phone,
  Eye,
  MoreHorizontal
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import { useNavigate } from "react-router-dom";
import FreightFilterModal from "./FreightFilterModal";
import SearchFilterBar from "../common_component/SearchFilterBar";

const mockAwardedLoads = [
  {
    id: "LOAD-002",
    requestedDate: "2024-03-16",
    subStatus: "Scheduled",
    project: "Storage Facility B",
    description: "Roll-up door panels",
    pickupLocation: "Dallas, TX",
    deliveryLocation: "San Antonio, TX",
    dates: { pickup: "2024-03-27", delivery: "2024-03-28" },
    carrier: { name: "Quick Haul Transport", phone: "(555) 222-3333" },
    budget: "$1,850",
    awardedAmount: "$1,850",
    bidsCount: "3 bids",
    status: "Awarded",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021",
    internalOwner: "Mike Johnson - Logistics",
    freightLoadId: "LOAD-0097",
    remarks: "Carrier confirmation request sent."
  },
  {
    id: "LOAD-005",
    requestedDate: "2024-03-16",
    subStatus: "In Transit",
    project: "Industrial Complex A",
    description: "Secondary steel beams",
    pickupLocation: "Houston, TX",
    deliveryLocation: "Austin, TX",
    dates: { pickup: "2024-03-28", delivery: "2024-03-29" },
    carrier: { name: "Fast Freight LLC", phone: "(555) 222-3333" },
    budget: "$1,850",
    awardedAmount: "$1,850",
    bidsCount: "3 bids",
    status: "Awarded",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021",
    internalOwner: "Mike Johnson - Logistics",
    freightLoadId: "LOAD-0097",
    remarks: "Carrier confirmation request sent."
  },
  {
    id: "LOAD-007",
    requestedDate: "2024-03-16",
    subStatus: "In Transit",
    project: "Warehouse Complex",
    description: "Electrical fixtures - bulk",
    pickupLocation: "San Antonio, TX",
    deliveryLocation: "Fort Worth, TX",
    dates: { pickup: "2024-03-30", delivery: "2024-03-31" },
    carrier: { name: "Regional Logistics", phone: "(555) 222-3333" },
    budget: "$1,850",
    awardedAmount: "$1,850",
    bidsCount: "3 bids",
    status: "Awarded",
    loadSize: "8,500 lbs",
    pallets: "12 pallets",
    deliveryLink: "DEL-1021",
    internalOwner: "Mike Johnson - Logistics",
    freightLoadId: "LOAD-0097",
    remarks: "Carrier confirmation request sent."
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
  }
];

const StatCard = ({ title, value, icon: Icon, color, borderL }: any) => (
  <div className={`flex-1 bg-white p-3 md:p-5 rounded-[14px] border border-l-2 md:border-l-4 ${borderL} flex flex-col justify-between font-inter min-w-[180px] md:h-32 transition-all hover:shadow-md`}>
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

const AwardedLoadsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const tableHeaders = [
    { label: "Request ID", align: "text-left" },
    { label: "Project", align: "text-left" },
    { label: "Description", align: "text-left" },
    { label: "Pickup Location", align: "text-left" },
    { label: "Delivery Location", align: "text-left" },
    { label: "Dates", align: "text-left" },
    { label: "Carrier", align: "text-left" },
    { label: "Budget & Bids", align: "text-left" },
    { label: "Status", align: "text-center" },
    { label: "Actions", align: "text-center" },
    { label: "Load Size / Weight", align: "text-left" },
    { label: "Delivery Link", align: "text-left" },
    { label: "Internal Owner", align: "text-left" },
    { label: "Freight Load ID", align: "text-left" },
    { label: "Logs", align: "text-left" },
  ];

  return (
    <div className="xl:pr-5 pb-5 space-y-8 mt-2 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
        <TitleSubtitle
          title="Awarded Loads"
          subtitle="Track all awarded freight loads"
        />

          <Button variant="gradient" size="sm" className="ml-auto">
            <Download size={18} className="mr-2" /> Export
          </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search awarded loads..."
        onFilterClick={() => setIsFilterModalOpen(true)}
      />

      {/* Awarded Loads Table */}
      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 min-h-[400px] flex flex-col shadow-sm">
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
              {mockAwardedLoads.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-2 md:p-4">
                    <div className="font-normal text-(--text-color-gray-5) text-sm">{item.id}</div>
                    <div className="text-[11px] font-normal text-[#919EAB] mt-0.5">Requested: {item.requestedDate}</div>
                    <div className="mt-2">
                      <span className="bg-[#EFF6FF] text-[#1E51A4] px-2 py-0.5 rounded text-[10px] font-medium border border-[#DBEAFE]">
                        {item.subStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 font-medium text-(--text-color-gray-5) text-sm">{item.project}</td>
                  <td className="p-2 md:p-4 text-(--text-color-gray-4) text-sm">{item.description}</td>
                  <td className="p-2 md:p-4 text-(--text-color-gray-5) text-sm">{item.pickupLocation}</td>
                  <td className="p-2 md:p-4 text-(--text-color-gray-5) text-sm">{item.deliveryLocation}</td>
                  <td className="p-2 md:p-4">
                    <div className="text-xs text-[#637381] font-medium">Pickup: <span className="text-(--text-color-gray-5) font-normal">{item.dates.pickup}</span></div>
                    <div className="text-xs text-[#637381] font-medium mt-1">Delivery: <span className="text-(--text-color-gray-5) font-normal">{item.dates.delivery}</span></div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="text-sm font-medium text-(--text-color-gray-5)">{item.carrier.name}</div>
                    <div className="flex items-center gap-1 text-[#1E51A4] text-xs mt-1">
                      <Phone size={12} />
                      {item.carrier.phone}
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="text-sm font-bold text-(--text-color-gray-5)">{item.budget}</div>
                    <div className="text-xs text-[#637381] mt-1">Awarded: <span className="font-medium">{item.awardedAmount}</span></div>
                    <div className="text-xs text-[#919EAB] mt-0.5">{item.bidsCount}</div>
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <CommonStatusBadge text={item.status} variant="green" />
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <Button 
                      variant="white" 
                      size="sm"
                      onClick={() => navigate(`/delivery/freight-request/${item.id}`)}
                    >
                      <Eye size={16} className="mr-2" /> View
                    </Button>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="text-sm font-normal text-(--text-color-gray-5)">{item.loadSize}</div>
                    <div className="text-xs font-medium text-[#637381]">{item.pallets}</div>
                  </td>
                  <td className="p-2 md:p-4 text-sm font-normal text-(--text-color-gray-5) underline decoration-[#919EAB] underline-offset-4 cursor-pointer hover:text-[#1E51A4] transition-colors">
                    {item.deliveryLink}
                  </td>
                  <td className="p-2 md:p-4 text-sm text-(--text-color-gray-5)">{item.internalOwner}</td>
                  <td className="p-2 md:p-4 text-sm text-(--text-color-gray-5)">{item.freightLoadId}</td>
                  <td className="p-2 md:p-4 text-sm text-(--text-color-gray-4)">
                    {item.remarks}
                  </td>
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

export default AwardedLoadsView;
